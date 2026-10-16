import {
    Directive,
    OnChanges,
    SimpleChanges,
    SimpleChange,
    OnDestroy,
    ChangeDetectorRef,
    InjectionToken,
    inject,
    InputSignal,
    input,
} from "@angular/core";

import { SelectItem } from "@openng/optimus-ui/api";
import { MultiSelect } from "@openng/optimus-ui/multiselect";
import { Select } from "@openng/optimus-ui/select";
import { SelectButton } from "@openng/optimus-ui/selectbutton";
import { Observable, Subject, takeUntil } from "rxjs";

interface Referentiel {
    code: string;
    libelle: string;
    ordre?: number;
}

export type Referentiels = Record<string, Array<Referentiel>>;
type FilterParentFn = (parentKey: keyof Referentiels, referentialCode: string, referentialKey: string) => Array<string>;
interface ReferentialQuery {
    selectActiveReferentialByType: (referentialKey: keyof Referentiels) => Observable<Array<Referentiel>>;
    getFileredParentValue?: FilterParentFn;
}

export const REFERENTIAL_QUERY: InjectionToken<ReferentialQuery> = new InjectionToken("referentialQuerySelfPopulate");

@Directive({ selector: "p-select[gaSelfPopulate], p-multiSelect[gaSelfPopulate], p-selectButton[gaSelfPopulate]" })
export class ReferentialSelfPopulateDirective implements OnChanges, OnDestroy {
    private readonly referentiel: ReferentialQuery = inject(REFERENTIAL_QUERY);
    private readonly selectCmp: Select | null = inject(Select, { optional: true, self: true });
    private readonly multiSelectCmp: MultiSelect | null = inject(MultiSelect, { optional: true, self: true });
    private readonly selectButton: SelectButton | null = inject(SelectButton, { optional: true, self: true });
    private readonly changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

    public referentialKeySnl: InputSignal<keyof Referentiels> = input.required({ alias: "referentialKey" });
    public referentialTypeParentSnl: InputSignal<keyof Referentiels | null> = input<keyof Referentiels | null>(null, {
        alias: "referentialTypeParent",
    });
    public referentialCodeParentSnl: InputSignal<string | null> = input<string | null>(null, {
        alias: "referentialCodeParent",
    });

    public optionsArray!: Array<SelectItem<string | undefined>>;
    public selfPopulatedCmp: Select | MultiSelect | SelectButton;
    private readonly disposeSignal$ = new Subject<void>();

    constructor() {
        const populatedCmp: Select | MultiSelect | SelectButton | null =
            this.selectCmp ?? this.multiSelectCmp ?? this.selectButton;

        if (populatedCmp === null) {
            throw new Error("You've applied the self populate directive on an invalid component");
        }

        this.selfPopulatedCmp = populatedCmp;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (changes["referentialKeySnl"]?.isFirstChange()) {
            this.setOptions(changes["referentialKeySnl"].currentValue);
        }
        const refCodeChange: SimpleChange | undefined = changes["referentialCodeParentSnl"];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (refCodeChange?.currentValue != null) {
            this.setAvailableOptions(refCodeChange.currentValue);
        } else {
            this.selfPopulatedCmp.options = this.optionsArray;
        }
    }

    public ngOnDestroy(): void {
        this.disposeSignal$.next();
        this.disposeSignal$.complete();
    }

    private setOptions(referentialKey: keyof Referentiels): void {
        this.referentiel
            .selectActiveReferentialByType(referentialKey)
            .pipe(takeUntil(this.disposeSignal$))
            .subscribe((x) => {
                this.optionsArray = x
                    .sort((a, b) => this.sortByOrderOrLibelle(a, b))
                    .map((option) => ({ label: option.libelle, value: option.code }));
                this.selfPopulatedCmp.options = [...this.optionsArray];
                this.changeDetectorRef.detectChanges();
            });
    }

    private setAvailableOptions(refCode: string): void {
        const filterParentFn: FilterParentFn | undefined = this.referentiel.getFileredParentValue;

        const referentialTypeParent: string | null = this.referentialTypeParentSnl();
        if (typeof filterParentFn === "function" && referentialTypeParent !== null) {
            const filteredValues: Array<string> = filterParentFn(
                referentialTypeParent,
                refCode,
                this.referentialKeySnl()
            );
            this.filterAvailableOptions(filteredValues);
            this.changeDetectorRef.detectChanges();
        }
    }

    private filterAvailableOptions(filteredValues: Array<string | undefined>): void {
        this.selfPopulatedCmp.options = this.optionsArray.filter((opt) => filteredValues.includes(opt.value));
        if (typeof this.selfPopulatedCmp.value === "object" && Array.isArray(this.selfPopulatedCmp.value)) {
            this.selfPopulatedCmp.writeValue(null);
        }
    }

    private sortByOrderOrLibelle(a: Referentiel, b: Referentiel): number {
        let predicate: number = 0;

        if (a.ordre !== undefined && b.ordre !== undefined) {
            predicate = a.ordre - b.ordre;
        }

        if (predicate === 0) {
            predicate = a.libelle.localeCompare(b.libelle);
        }

        return predicate;
    }
}
