import { Location } from "@angular/common";
import { provideLocationMocks } from "@angular/common/testing";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Router, RouterOutlet, provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";

import { MenuItem } from "@openng/optimus-ui/api";

import { SidebarComponent } from "./sidebar.component";

describe("SidebarComponent", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    let sidebarComponent: SidebarComponent;

    let routerHarness: RouterTestingHarness;
    let location: Location;

    let routerSpy: Router;

    const defaultMenuEntries: Array<MenuItem> = [
        { label: "Entry1", routerLink: "entry1" },
        { label: "Entry2", routerLink: "entry2" },
        { label: "Entry3", routerLink: "entry3" },
    ];

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [
                provideRouter([
                    {
                        path: "",
                        component: TestHostComponent,
                        children: [
                            {
                                path: "entry1",
                                component: RoutedComponentDummy,
                            },
                            {
                                path: "entry2",
                                component: RoutedComponentDummy,
                            },
                            {
                                path: "entry3",
                                component: RoutedComponentDummy,
                            },
                        ],
                    },
                ]),
                provideLocationMocks(),
            ],
        }).compileComponents();

        routerSpy = TestBed.inject(Router);
        location = TestBed.inject(Location);
        routerHarness = await RouterTestingHarness.create();
        fixture = routerHarness.fixture as unknown as ComponentFixture<TestHostComponent>;
        component = await routerHarness.navigateByUrl("/", TestHostComponent);
        sidebarComponent = fixture.debugElement.query(By.directive(SidebarComponent)).componentInstance;

        component.menu = defaultMenuEntries;
    });

    afterEach(() => {
        component.menu = defaultMenuEntries;
    });

    it("should display a menu entry for each menu item received as input", () => {
        // Arrange, Act
        fixture.detectChanges();
        const menuItemsEl = fixture.debugElement.queryAll(By.css("ul li"));
        const hasAllEntries = menuItemsEl.every(
            (i, index) => i.nativeElement.textContent.trim() === component.menu[index]?.label
        );

        // Assert
        expect(menuItemsEl.length).toEqual(component.menu.length);
        expect(hasAllEntries).toBe(true);
    });

    it("should NOT display a menu entry if her associated visible condition is not met", () => {
        // Arrange
        const notVisibleEntry = { label: "Entry2", visible: false };
        component.menu = [{ label: "Entry1", visible: true }, notVisibleEntry];

        // Act
        fixture.detectChanges();
        const menuItemsEl = fixture.debugElement.queryAll(By.css("ul li"));
        const notVisibleEntryEl = fixture.debugElement
            .queryAll(By.css("ul li"))
            .find((i) => i.nativeElement.textContent === notVisibleEntry.label);

        // Assert
        expect(menuItemsEl.length).toEqual(1);
        expect(notVisibleEntryEl).toBeUndefined();
    });

    it("should display the menu entry associated icon when it's provided", () => {
        // Arrange
        const testIcon = "pi-test";
        component.menu = [{ label: "Entry1", icon: testIcon }];

        // Act
        fixture.detectChanges();
        const menuItemIconEl = fixture.debugElement.query(By.css("ul li i"));

        // Assert
        expect(menuItemIconEl.nativeElement.classList.contains(testIcon)).toBe(true);
    });

    it("should highlight the active menu entry", async () => {
        // Arrange
        fixture.detectChanges();
        const menuItemsEl = fixture.debugElement.queryAll(By.css("ul li"));

        const testEntryIndex = 1;
        const testMenuItemEl = menuItemsEl[testEntryIndex];

        // Act
        await routerHarness.navigateByUrl(`/${defaultMenuEntries[testEntryIndex]?.routerLink}`);
        fixture.detectChanges();

        // Assert
        expect(menuItemsEl[0]?.nativeElement.classList.contains("is-active")).toBe(false);
        expect(menuItemsEl[2]?.nativeElement.classList.contains("is-active")).toBe(false);
        expect(testMenuItemEl?.nativeElement.classList.contains("is-active")).toBe(true);
    });

    it("should navigate on menu button click when there is no associated command", fakeAsync(() => {
        // Arrange
        fixture.detectChanges();
        const testEntryIndex = 2;

        const menuItemEl = fixture.debugElement.queryAll(By.css("ul li"))[testEntryIndex];
        const expectedUrl = `/${defaultMenuEntries[testEntryIndex]?.routerLink}`;

        expect(location.path()).toEqual("/");

        // Act
        menuItemEl?.nativeElement.click();
        tick();

        // Assert
        expect(location.path()).toEqual(expectedUrl);
    }));

    it("should keep the query params on active url navigation", fakeAsync(async () => {
        // Arrange
        fixture.detectChanges();

        const testEntryIndex = 0;
        const testQueryParam = { test: "paramValue" };
        const expectedUrl = `/${defaultMenuEntries[testEntryIndex]?.routerLink}?test=${testQueryParam.test}`;
        const testMenuItem = fixture.debugElement.queryAll(By.css("ul li"))[testEntryIndex];
        const navigateSpy = jest.spyOn(routerSpy, "navigate");

        expect(component.menu[testEntryIndex]?.queryParams).toBeUndefined();

        await routerHarness.navigateByUrl(expectedUrl);

        expect(location.path()).toEqual(expectedUrl);

        // Act
        testMenuItem?.nativeElement.click();
        fixture.detectChanges();

        // Assert
        expect(navigateSpy).toHaveBeenCalled();
        expect(location.path()).toEqual(expectedUrl);
    }));

    it("should use the provided query params when it does not navigate on the active url", fakeAsync(() => {
        // Arrange
        const [fakeTestParam, fakeParamValue] = ["fakeTestParam", "fakeParamValue"];
        component.menu = [{ label: "Entry1", routerLink: "entry1", queryParams: { [fakeTestParam]: fakeParamValue } }];

        fixture.detectChanges();
        const testMenuItem = fixture.debugElement.query(By.css("ul li"));
        const expectedUrl = `/${component.menu[0]?.routerLink}?${fakeTestParam}=${fakeParamValue}`;

        expect(location.path()).toEqual("/");

        // Act
        testMenuItem.nativeElement.click();
        tick();

        // Arrange
        expect(location.path()).toEqual(expectedUrl);
    }));

    it("should use the provided queryParamsHandling strategy when it does not navigate on the active url", fakeAsync(() => {
        // Arrange
        const testQueryParamHandling = "merge";
        component.menu = [{ label: "Entry1", routerLink: "entry1", queryParamsHandling: testQueryParamHandling }];

        fixture.detectChanges();
        const testMenuItem = fixture.debugElement.query(By.css("ul li"));
        const navigateSpy = jest.spyOn(routerSpy, "navigate");

        // Act
        testMenuItem.nativeElement.click();
        tick();

        // Assert
        expect(navigateSpy).toHaveBeenCalledWith([component.menu[0]?.routerLink], {
            queryParams: undefined,
            queryParamsHandling: testQueryParamHandling,
        });
    }));

    it("should execute the associated command if its provided on menu button click instead of the default navigation", fakeAsync(() => {
        // Arrange
        const commandSpy = jest.fn();
        component.menu = [{ label: "Entry1", routerLink: "entry1", command: commandSpy }];

        fixture.detectChanges();
        const testMenuItem = fixture.debugElement.query(By.css("ul li"));
        const navigateSpy = jest.spyOn(routerSpy, "navigate");

        // Act
        testMenuItem.nativeElement.click();
        tick();

        // Assert
        expect(navigateSpy).not.toHaveBeenCalled();
        expect(commandSpy).toHaveBeenCalled();
    }));

    it("should be able to reduce in size on toggle button click when it's extended", () => {
        // Arrange
        const openSidenavBtn = fixture.debugElement.query(By.css(".close-btn"));
        const sidebarHost = fixture.debugElement.query(By.directive(SidebarComponent));
        const toggleIcon = fixture.debugElement.query(By.css("i.pi"));
        const logo = fixture.debugElement.query(By.css("img[alt='Col. St Barthélémy']"));
        let reduceLabel = fixture.debugElement.query(By.css(".close-label"));

        fixture.detectChanges();

        expect(sidebarComponent.openedSnl()).toEqual(true);
        expect(reduceLabel.nativeElement.textContent.trim()).toEqual("réduire");

        // Act
        openSidenavBtn.nativeElement.click();
        fixture.detectChanges();

        reduceLabel = fixture.debugElement.query(By.css(".close-label"));

        // Assert
        expect(sidebarComponent.openedSnl()).toEqual(false);
        expect(sidebarHost.nativeElement.classList.contains("sidebar-small")).toBe(true);
        expect(toggleIcon.nativeElement.classList.contains("pi-angle-double-right")).toBe(true);
        expect(toggleIcon.nativeElement.classList.contains("pi-angle-double-left")).toBe(false);
        expect(logo.nativeElement.classList.contains("opened")).toBe(true);
        expect(reduceLabel).toBeNull();
    });

    it("should be able to extend in size on toggle button click when it's reduced", () => {
        // Arrange
        sidebarComponent.openedSnl.set(false);
        fixture.detectChanges();

        const openSidenavBtn = fixture.debugElement.query(By.css(".close-btn"));
        const sidebarHost = fixture.debugElement.query(By.directive(SidebarComponent));
        const toggleIcon = fixture.debugElement.query(By.css("i.pi"));
        const logo = fixture.debugElement.query(By.css("img[alt='Col. St Barthélémy']"));
        let reduceLabel = fixture.debugElement.query(By.css(".close-label"));

        expect(reduceLabel).toBeNull();

        // Act
        openSidenavBtn.nativeElement.click();
        fixture.detectChanges();

        reduceLabel = fixture.debugElement.query(By.css(".close-label"));

        // Assert
        expect(sidebarComponent.openedSnl()).toEqual(true);
        expect(sidebarHost.nativeElement.classList.contains("sidebar-small")).toBe(false);
        expect(toggleIcon.nativeElement.classList.contains("pi-angle-double-right")).toBe(false);
        expect(toggleIcon.nativeElement.classList.contains("pi-angle-double-left")).toBe(true);
        expect(logo.nativeElement.classList.contains("opened")).toBe(false);
        expect(reduceLabel.nativeElement.textContent.trim()).toEqual("réduire");
    });
});

@Component({
    selector: "ga-test-host",
    template: `<nav gaSidebar [menuItems]="menu"></nav>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SidebarComponent],
})
export class TestHostComponent {
    public menu!: Array<MenuItem>;
}

@Component({
    selector: "app-dummy",
    template: "<router-outlet /><p>dummy component</p>",
    standalone: true,

    imports: [RouterOutlet],
})
class RoutedComponentDummy {}
