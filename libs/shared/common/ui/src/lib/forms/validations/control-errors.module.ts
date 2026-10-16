import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { ControlErrorsDirective } from "./control-errors.directive";
import { ErrorMessageComponent } from "./error-message/error-message.component";
import { ErrorMessagesPipe } from "./error-message/error-message.pipe";
import { GestionActeValidators } from "./gestion-acte.validators";

@NgModule({
    declarations: [ErrorMessageComponent, ControlErrorsDirective, ErrorMessagesPipe],
    imports: [ReactiveFormsModule],
    exports: [ErrorMessageComponent, ControlErrorsDirective, ErrorMessagesPipe],
    providers: [GestionActeValidators],
})
export class ControlErrorsModule {}
