import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidators{

    private fields: any;

    constructor(fields: any){
        this.fields = fields;
    }

    validateExpression: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
        const pass = group.parent?.get(this.fields[1])?.value;
        const regx = this.fields[0];
        return regx.test(pass) ? null : { required: true }
    }
}
