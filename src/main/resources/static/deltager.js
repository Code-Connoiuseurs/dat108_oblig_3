
class DeltagerManager {
    #startnummer;
    #deltagernavn;
    #sluttid;
    #regmld;
    #regstartnr = [];
    #registrertedeltagere = [];

    constructor(root) {
        this.#startnummer = document.querySelector("#startnummer");
        this.#deltagernavn = document.querySelector("#deltagernavn");
        this.#sluttid = document.querySelector("#sluttid");

        const registrerBt = root.querySelector("fieldset.registrering button[type='button']");
        registrerBt.addEventListener("click", () => this.registrerDeltager());

        const visDeltagerBt = root.querySelector("fieldset.resultat button[type='button']");
        visDeltagerBt.addEventListener("click", () => this.visDeltager());

        this.#regmld = root.querySelector("p.hidden");
    }

    // registrerer deltageren og handterer feil.
    registrerDeltager() {
        const startnummer = this.#startnummer.value;
        let deltagernavn = this.#deltagernavn.value;
        const sluttid = this.#sluttid.value;

        if (!startnummer || !deltagernavn || !sluttid) {
            console.log("mangler inputs: popopapap");
            return;
        }

        let harError = false;

        if (this.#regstartnr.includes(startnummer)) {
            this.#startnummer.setCustomValidity(`startnummer ${startnummer} er allerede registrert`);
            this.#startnummer.reportValidity();
            harError = true;
        } else {
            this.#startnummer.setCustomValidity("");
        }

        if (!(/^[A-Za-zÆØÅæøå]+(?:[\s-][A-Za-zÆØÅæøå]+)*$/).test(deltagernavn)) {
            this.#deltagernavn.setCustomValidity("Ugyldig navn");
            this.#deltagernavn.reportValidity();
            harError = true;
        } else {
            this.#deltagernavn.setCustomValidity("");
        }

        if (harError) {
            console.log("validering error");
            return;
        }

        deltagernavn = this.storBokstav(deltagernavn);

        this.#registrertedeltagere.push({ startnummer, deltagernavn, sluttid });
        this.#regstartnr.push(startnummer);
        console.log("registrerte deltagere", { startnummer, deltagernavn, sluttid });

        this.oppdaterRegMld(deltagernavn, startnummer, sluttid);
        this.clearInput();
    }

    // oppdaterer navn, startnr og slutt tid til den ny registrerte
    oppdaterRegMld(deltagernavn, startnummer, sluttid) {
        const spans = this.#regmld.querySelectorAll("span");
        spans[0].textContent = deltagernavn;
        spans[1].textContent = startnummer;
        spans[2].textContent = sluttid;

        this.#regmld.classList.remove("hidden");
    }

    storBokstav(navn) {
        return navn
            .split(/(\s+|-)/)
            .map(delnavn => delnavn.charAt(0).toUpperCase() + delnavn.slice(1).toLowerCase())
            .join('');
    }

    clearInput() {
        console.log("Clear input");
        this.#startnummer.value = "";
        this.#deltagernavn.value = "";
        this.#sluttid.value = "";
        this.#startnummer.focus();
    }

    visDeltager() {
        console.log("vis deltagere");
        const fraTid = document.querySelector("#nedregrense").value;
        const tilTid = document.querySelector("#ovregrense").value;
        const tilTidInput = document.querySelector("#ovregrense");

        // fraTid og tilTid og ikke bra fraTid > tilTid for å være sikker at det er valide verdier vi comparer med. 
        if (fraTid && tilTid && fraTid > tilTid) {
            tilTidInput.setCustomValidity("Øvre grense må være større enn nedre.");
            tilTidInput.reportValidity();
            return;
        } else {
            tilTidInput.setCustomValidity("");
        }

        let deltagerVis = [...this.#registrertedeltagere]; // kopierer registrerte listen

        if (fraTid) {
            deltagerVis = deltagerVis.filter(deltager => deltager.sluttid >= fraTid);
        }
        if (tilTid) {
            deltagerVis = deltagerVis.filter(deltager => deltager.sluttid <= tilTid);
        }
        // sorterer etter sluttid
        deltagerVis.sort((a, b) => a.sluttid.localeCompare(b.sluttid));

        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        const ingenResultater = document.querySelector(".liste p");
        if (deltagerVis.length > 0) {
            ingenResultater.classList.add("hidden");
            deltagerVis.forEach((deltager, index) => {
                const rad = document.createElement("tr");
                rad.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${deltager.startnummer}</td>
                            <td>${deltager.deltagernavn}</td>
                            <td>${deltager.sluttid}</td>
                            `;
                tbody.appendChild(rad); // <- legger det til i tr body
            });
        } else {
            ingenResultater.classList.remove("hidden");
        }
    }

}
const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);