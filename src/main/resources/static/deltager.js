"use strict"

class DeltagerManager {
	#startNrInput;
	#deltagerNavnInput;
	#sluttTidInput;
	#deltagerOutput;

	#fraTidInput;
	#tilTidInput;
	#listeTableBody;
	#listeIngenResultater;
	
	#deltagere = {};

    constructor(root) {
		this.#startNrInput = root.querySelector("#startnummer");
		this.#deltagerNavnInput = root.querySelector("#deltagernavn");
		this.#sluttTidInput = root.querySelector("#sluttid");
		this.#deltagerOutput = root.querySelector("p.hidden");
		
		const registrerButton = root.querySelector("fieldset.registrering button");
		registrerButton.addEventListener("click", () => this.#registrerDeltager());

		this.#fraTidInput = root.querySelector("#nedregrense");
		this.#tilTidInput = root.querySelector("#ovregrense");
		this.#listeTableBody = root.querySelector("div.liste tbody")
		this.#listeIngenResultater = root.querySelector("div.liste p")

		const visDeltagereButton = root.querySelector("fieldset.resultat button");
		visDeltagereButton.addEventListener("click", () => this.#visDeltagere());
    }
	
	#registrerDeltager() {
		let startNr = this.#startNrInput.value;
		let deltagerNavn = this.#deltagerNavnInput.value;
		let sluttTid = this.#sluttTidInput.value;
		
		if (startNr === "" || deltagerNavn.length < 2 || sluttTid === "") return;
		
		if (startNr in this.#deltagere) {
			this.#startNrInput.setCustomValidity("Dette startnummeret er allerede registrert");
			this.#startNrInput.reportValidity();
			this.#startNrInput.focus();
			return;
		}
		
		if (!(/^[A-Za-zÆØÅæøå]+(?:[\s-][A-Za-zÆØÅæøå]+)*$/).test(deltagerNavn)) {
			this.#deltagerNavnInput.setCustomValidity("Tillate tegn er kun bokstaver, mellomrom og enkel bindestrek mellom delnavn");
			this.#deltagerNavnInput.reportValidity();
			this.#deltagerNavnInput.focus();
			return;
		}
		
		deltagerNavn = this.#formaterNavn(deltagerNavn);
		
		let nyDeltager = {
			deltagerNavn,
			sluttTid,
		};
		
		this.#deltagere[startNr] = nyDeltager;
		
		this.#startNrInput.value = "";
		this.#deltagerNavnInput.value = "";
		this.#sluttTidInput.value = "";
		this.#startNrInput.setCustomValidity("");
		this.#deltagerNavnInput.setCustomValidity("");
		this.#startNrInput.focus();
		
		const deltagerOutputs = this.#deltagerOutput.querySelectorAll("span");
		deltagerOutputs[0].innerText = deltagerNavn;
		deltagerOutputs[1].innerText = startNr;
		deltagerOutputs[2].innerText = sluttTid;
		this.#deltagerOutput.classList.remove("hidden");
		
		return;
	}
	
	#formaterNavn(navn) {
	    return navn
	        .split(/(\s+|-)/)
	        .map(delnavn => delnavn.charAt(0).toUpperCase() + delnavn.slice(1).toLowerCase())
	        .join("");
	}
	
	#visDeltagere() {
		const fraTid = this.#fraTidInput.value;
		const tilTid = this.#tilTidInput.value;
		
		if (fraTid !== "" && tilTid !== "" && fraTid > tilTid) {
			this.#tilTidInput.setCustomValidity("Øvre grense må være større enn nedre grense");
			this.#tilTidInput.reportValidity();
			this.#tilTidInput.focus();
			return;
		}
		this.#tilTidInput.setCustomValidity("");
		this.#listeTableBody.innerHTML = "";

		let sorterteDeltagere;
		sorterteDeltagere = Object.entries(this.#deltagere);
		sorterteDeltagere.sort((a, b) => a[1].sluttTid > b[1].sluttTid);
		sorterteDeltagere.forEach((deltager, indeks) => deltager[2] = indeks+1);

		if (fraTid !== "") {
			sorterteDeltagere = sorterteDeltagere.filter(a => a[1].sluttTid >= fraTid);
		}

		if (tilTid !== "") {
			sorterteDeltagere = sorterteDeltagere.filter(a => a[1].sluttTid <= tilTid);
		}

		if (sorterteDeltagere.length < 1) {
			this.#listeIngenResultater.classList.remove("hidden");
			return;
		}

		this.#listeIngenResultater.classList.add("hidden");
	
		sorterteDeltagere.forEach(deltager => {
			let nyrad = document.createElement("tr");
			let radData;

			// Plassering
			radData = document.createElement("td");
			radData.innerText = deltager[2];
			nyrad.appendChild(radData);

			// Startnummer
			radData = document.createElement("td");
			radData.innerText = deltager[0];
			nyrad.appendChild(radData);

			// Navn
			radData = document.createElement("td");
			radData.innerText = deltager[1].deltagerNavn;
			nyrad.appendChild(radData);

			// Sluttid
			radData = document.createElement("td");
			radData.innerText = deltager[1].sluttTid;
			nyrad.appendChild(radData);
			
			this.#listeTableBody.appendChild(nyrad);
		})
	}
}
	
const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);
