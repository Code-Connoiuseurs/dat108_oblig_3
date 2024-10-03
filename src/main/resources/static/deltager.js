"use strict"

class DeltagerManager {
	#startNrInput;
	#deltagerNavnInput;
	#sluttTidInput;
	#deltagerOutput;
	
	#deltagere = {};

    constructor(root) {
		this.#startNrInput = root.querySelector("#startnummer");
		this.#deltagerNavnInput = root.querySelector("#deltagernavn");
		this.#sluttTidInput = root.querySelector("#sluttid");
		this.#deltagerOutput = root.querySelector("p.hidden");
		
		const registrerButton = document.querySelector("fieldset.registrering button");
		registrerButton.addEventListener("click", () => this.#registrerDeltager());
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
	
}
	
const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);
