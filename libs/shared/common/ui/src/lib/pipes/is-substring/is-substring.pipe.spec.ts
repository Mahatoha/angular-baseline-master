import { IsSubstringPipe } from "./is-substring.pipe";

describe("IsSubstringPipe", () => {
    let isSubstringPipe: IsSubstringPipe;

    beforeEach(() => {
        isSubstringPipe = new IsSubstringPipe();
    });

    it("should be able to determine if the string given as param includes the provided string", () => {
        // Arrange
        const routerLink = "/route1";
        const activeUrl = "/route1/subroute1/24";
        const secondActiveUrl = "route2/subroute1/24";

        // Act
        const result = isSubstringPipe.transform(routerLink, activeUrl);
        const result2 = isSubstringPipe.transform(routerLink, secondActiveUrl);

        // Assert
        expect(result).toEqual(true);
        expect(result2).toEqual(false);
    });
});
