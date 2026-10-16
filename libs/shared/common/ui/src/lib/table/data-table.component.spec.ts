import { Component, ChangeDetectionStrategy } from "@angular/core";

import { Table, TableModule } from "@openng/optimus-ui/table";

import { GestionActeDataTable } from "./data-table.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("GestionActeDataTable", () => {
    let fixture: ComponentFixture<ConcreteDataTableComponent>;
    let concreteDataTable: ConcreteDataTableComponent;
    const isSelected: (id: number) => boolean = (id: number) =>
        concreteDataTable.selection.find((s) => s.id === id) != null;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ConcreteDataTableComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(ConcreteDataTableComponent);
        concreteDataTable = fixture.componentInstance;
        concreteDataTable.selection = [{ id: 1 }];
        expect(concreteDataTable.selection.length).toEqual(1);
    });

    it("should be able to add a row from the current selection", () => {
        // Arrange
        const selectedId: number = 1;

        // Act
        concreteDataTable.toggleSelectedRow({ id: selectedId }, true);

        // Assert
        expect(isSelected(selectedId)).toEqual(true);
        expect(concreteDataTable.selection.length).toEqual(2);
    });

    it("should be able to remove a row from the current selection", () => {
        // Arrange
        const selectedId: number = 3;
        concreteDataTable.toggleSelectedRow({ id: selectedId }, true);
        expect(isSelected(selectedId)).toEqual(true);

        // Act
        concreteDataTable.toggleSelectedRow({ id: selectedId }, false);

        // Assert
        expect(isSelected(selectedId)).toEqual(false);
        expect(concreteDataTable.selection.length).toEqual(1);
    });

    it("should be able to manage a list of row selections", () => {
        // Arrange
        const firstSelectedId: number = 3;
        const secondSelectedId: number = 4;

        // Act
        concreteDataTable.toggleSelectedRow({ id: firstSelectedId }, true);
        concreteDataTable.toggleSelectedRow({ id: secondSelectedId }, true);

        // Assert
        expect(isSelected(firstSelectedId)).toEqual(true);
        expect(isSelected(secondSelectedId)).toEqual(true);
        expect(concreteDataTable.selection.length).toEqual(3);
    });

    it("should be able to track row by entity id", () => {
        // Arrange
        const row: { id: number } = { id: 5 };

        // Act
        const trackByResult: number = concreteDataTable.trackById(row.id, { id: row.id });

        // Assert
        expect(trackByResult).toEqual(row.id);
    });

    /** We are testing the private API here as we are testing an abstract class, you're not supposed to do this for regular cmp */
    it("should be able to reset the rows selection", () => {
        // Arrange
        concreteDataTable.selection = [{ id: 1 }, { id: 2 }];
        expect(concreteDataTable.selection.length).toEqual(2);

        // Act
        (concreteDataTable as any).resetSelectedRows();

        // Assert
        expect(concreteDataTable.selection.length).toEqual(0);
    });
});

@Component({
    selector: "ga-concrete-data-table",
    template: `<p-table />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule]
})
class ConcreteDataTableComponent extends GestionActeDataTable<{ id: number }> {}