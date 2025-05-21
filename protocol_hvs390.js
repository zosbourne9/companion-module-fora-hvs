// hvs390hs_config.js (or whatever you want to name it)
module.exports = {
	HVS390HS: {
		COMMANDS: {
			// These might be the same or need slight adjustments for HVS-390HS
			GET_INPUTS: 'GET.SIGNAL_GROUP2', // Verify if this gets all inputs relevant to HVS-390HS

			// CRITICAL: How do you get ME1 state vs ME2 state?
			// GET_STATE_ME1: 'GET.ALLDATA_ME_XPT_ME1', // Example - NEED PROTOCOL DOCS
			// GET_STATE_ME2: 'GET.ALLDATA_ME_XPT_ME2', // Example - NEED PROTOCOL DOCS
			// Or is it one command that returns all ME data?
			// For now, let's assume a generic one that might need parsing or ME-specific query later
			GET_ALL_ME_STATE: 'GET.ALLDATA_ME_XPT', // Placeholder - Verify actual command

			REBOOT: 'CMD.020503', // Likely the same

			// event: 2-digit hex for the selected event
			RECALL_EVENT: 'CMD.030502{event}', // Likely the same

			// macroHex: 2-digit hex for the selected macro
			RECALL_MACRO: 'CMD.04058100{macroHex}', // Likely the same

			// me: which me to transition (e.g., 1 or 2)
			TRANS_ME_AUTO: 'SET.ME_XPT_ME{me}_BKGD_TRS_AUTO_STAT:1',
			TRANS_ME_CUT: 'SET.ME_XPT_ME{me}_BKGD_TRS_AUTO_STAT:3',

			// me: which me owns the key (e.g., 1 or 2)
			// key: which key to transition (e.g., 1, 2, 3 for DSK1, 4 for DSK2 on that ME)
			// IMPORTANT: Verify key numbering for ME1 vs ME2 and if DSKs are part of the same key numbering
			TRANS_KEY_AUTO: 'SET.ME_XPT_ME{me}_KEY{key}_TRS_AUTO_STAT:1',
			TRANS_KEY_CUT: 'SET.ME_XPT_ME{me}_KEY{key}_TRS_AUTO_STAT:3',

			// me: which me to set (e.g., 1 or 2)
			// layer: which layer to set (e.g., A or B)
			// source: id of the selected source
			XPT_ME: 'SET.ME_XPT_ME{me}_BKGD_{layer}:{source}',

			// aux: which aux to set;
			// source: id of the selected source
			XPT_AUX: 'SET.ME_XPT_AUX{aux}:{source}', // Verify aux numbering and available sources

			// --- ADD HVS-390HS SPECIFIC COMMANDS FOR ME2 IF DIFFERENT ---
			// Example: If setting ME2 program has a totally different command structure
			// XPT_ME2_PGM: 'SET.SOME_OTHER_COMMAND_FOR_ME2_PGM:{source}',
		},
		ME_LAYERS: { A: 'A', B: 'B' }, // Likely the same: Program, Preview
		AUXES: [ // Verify the number of AUX buses on HVS-390HS
			{ id: 1, label: 'Aux 1' },
			{ id: 2, label: 'Aux 2' },
			{ id: 3, label: 'Aux 3' },
			{ id: 4, label: 'Aux 4' },
			{ id: 5, label: 'Aux 5' },
			{ id: 6, label: 'Aux 6' },
			{ id: 7, label: 'Aux 7' },
			{ id: 8, label: 'Aux 8' },
			// Add more if HVS-390HS has more
		],
		VARIABLES: [ // These will need to be registered in your main module
			{ label: 'Last event to be recalled', name: 'event_recall' },

			// ME1 Variables
			{ label: 'ME1: KEY 1 OnAir', name: 'me1_key1_onair' }, // Adjusted naming for clarity
			{ label: 'ME1: KEY 2 OnAir', name: 'me1_key2_onair' },
			{ label: 'ME1: DSK 1 OnAir', name: 'me1_dsk1_onair' }, // Assuming key 3 is DSK1 for ME1
			{ label: 'ME1: DSK 2 OnAir', name: 'me1_dsk2_onair' }, // Assuming key 4 is DSK2 for ME1
			{ label: 'ME1: Program Input', name: 'me1_program_input' },
			{ label: 'ME1: Preview Input', name: 'me1_preview_input' },

			// ME2 Variables
			{ label: 'ME2: KEY 1 OnAir', name: 'me2_key1_onair' },
			{ label: 'ME2: KEY 2 OnAir', name: 'me2_key2_onair' },
			{ label: 'ME2: DSK 1 OnAir', name: 'me2_dsk1_onair' }, // Assuming key 1 on ME2 is ME2_KEY1, key 3 might be ME2_DSK1
			{ label: 'ME2: DSK 2 OnAir', name: 'me2_dsk2_onair' },
			{ label: 'ME2: Program Input', name: 'me2_program_input' },
			{ label: 'ME2: Preview Input', name: 'me2_preview_input' },
		],
		MES: [ // Defining available MEs for dropdowns etc.
			{ id: 1, label: 'ME 1' },
			{ id: 2, label: 'ME 2' },
		],
		// KEY MAPPING: This is critical and needs verification with HVS-390HS manual
		// How are Keyers (KEY) and Downstream Keyers (DSK) addressed per ME?
		// The HVS100 example used '1,1' (ME1,Key1), '1,3' (ME1,DSK1).
		// We need to know how this applies to ME2.
		// Option 1: Key numbers are unique across MEs (e.g. ME1_Key1=1, ME1_Key2=2, ME2_Key1=3, ME2_Key2=4)
		// Option 2: Key numbers are relative to ME (e.g. ME1_Key1=1, ME2_Key1=1) and command targets ME.
		// The TRANS_KEY_AUTO/CUT commands suggest Option 2 is more likely ("ME{me}_KEY{key}")
		// Let's assume keys are numbered 1-N within each ME.
		// And assume DSKs might also be treated as keys in the command (e.g., KEY3, KEY4 for DSK1, DSK2)
		KEYS_PER_ME: [ // Generic list of keys available *within* an ME
			{ id: 1, label: 'KEY 1' },
			{ id: 2, label: 'KEY 2' },
			{ id: 3, label: 'DSK 1' }, // Assuming DSK1 is addressed as KEY3 on its ME
			{ id: 4, label: 'DSK 2' }, // Assuming DSK2 is addressed as KEY4 on its ME
			// Verify actual number of KEYs and DSKs per ME on HVS-390HS
		],
		// The old KEYS structure might be less useful if commands are ME-specific like 'SET.ME_XPT_ME{me}_KEY{key}...'
		// Instead, you'll combine an ME choice with a key choice from KEYS_PER_ME.

		// SOURCES: Verify these against HVS-390HS capabilities
		get SOURCES_ME() { // Sources available for ME crosspoints
			let inputs = [
				// Built-in Inputs (Verify count for HVS-390HS)
				{ id: 1, label: 'Input 1' }, { id: 2, label: 'Input 2' }, { id: 3, label: 'Input 3' }, { id: 4, label: 'Input 4' },
				{ id: 5, label: 'Input 5' }, { id: 6, label: 'Input 6' }, { id: 7, label: 'Input 7' }, { id: 8, label: 'Input 8' },
				// Optional expansion card inputs (Verify count for HVS-390HS)
				{ id: 9, label: 'Input 9' }, { id: 10, label: 'Input 10' }, { id: 11, label: 'Input 11' }, { id: 12, label: 'Input 12' },
				{ id: 13, label: 'Input 13' }, { id: 14, label: 'Input 14' }, { id: 15, label: 'Input 15' }, { id: 16, label: 'Input 16' },
				{ id: 17, label: 'Input 17' }, { id: 18, label: 'Input 18' }, { id: 19, label: 'Input 19' }, { id: 20, label: 'Input 20' },
				// Add more if HVS-390HS has more physical inputs
			];
			let system = [
				// System inputs (Verify IDs and availability for HVS-390HS)
				{ id: 0, label: 'Black' },
				{ id: 29, label: 'Still 1' }, { id: 30, label: 'Still 2' }, // Verify still store IDs and count
				// Check if HVS-390HS has more stills or different IDs
				{ id: 37, label: 'Color Bars' },
				{ id: 38, label: 'Matte 1' }, { id: 39, label: 'Matte 2' }, // Verify matte generator IDs
				// The following might be different or have different IDs on HVS-390HS
				{ id: 40, label: 'Color Key Fill' }, // Often internal, verify
				{ id: 41, label: 'Color Key Key' },  // Often internal, verify
				// Sub Effect might be specific to HVS-100. Verify for HVS-390HS.
				// { id: 42, label: 'Sub Effect 1' },
				// { id: 43, label: 'Sub Effect 2' },
			];
			// Add any other internal sources for HVS-390HS (e.g., PGM/PV from other MEs if routable)
			return inputs.concat(system.sort((a, b) => (a.label > b.label ? 1 : -1)));
		},
		get SOURCES_AUX() { // Sources available for AUX crosspoints
			let meOutputs = [
				// CRITICAL: Verify these IDs from HVS-390HS Protocol Docs
				// These are educated guesses for what *might* be available.
				{ id: 46, label: 'ME1 Program' }, // Placeholder ID
				{ id: 47, label: 'ME1 Preview' }, // Placeholder ID
				{ id: 48, label: 'ME1 Clean Feed' }, // Placeholder ID (if available)
				{ id: 56, label: 'ME2 Program' }, // Placeholder ID
				{ id: 57, label: 'ME2 Preview' }, // Placeholder ID
				{ id: 58, label: 'ME2 Clean Feed' }, // Placeholder ID (if available)
				{ id: 50, label: 'Multi-View 1' }, // Placeholder ID (verify output options)
				// Add other ME outputs or specific outputs like Multi-viewer if assignable to AUX
			];
			const baseMESources = this.SOURCES_ME; // Get all regular ME sources
			return baseMESources.concat(meOutputs.sort((a, b) => (a.label > b.label ? 1 : -1)))
			                  .sort((a,b) => (a.id > b.id ? 1 : -1)); // Sort all for consistency
		},
	},
}