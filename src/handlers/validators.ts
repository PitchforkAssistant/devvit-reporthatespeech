import {SettingsFormFieldValidatorEvent} from "@devvit/public-api";
import {ERRORS} from "../constants.js";

export async function validatePrecentage (event: SettingsFormFieldValidatorEvent<number>) {
    if (event.value === undefined) {
        return;
    }
    if (event.value < 0 || event.value > 100) {
        return ERRORS.INVALID_PRECENTAGE;
    }
}
