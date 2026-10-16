import GestionActeTheme from "@gestion-acte/theme";
import { definePreset, palette } from "@openng/optimus-ui-themes";

export default definePreset(GestionActeTheme, {
    semantic: {
        primary: palette("{blue}"),
    },
    components: {},
});
