
export interface Theme {
    background: string;
    content_background: string;
    foreground: string;
    highlight: string;
    text: string;
    text_background: string;
}

export const defaultTheme: Theme = {
    background: "#212530",
    content_background: "#4a4e63",
    foreground: "#66A6BE",
    highlight: "#D85480",
    text: "#ffffff",
    text_background: "#EEE8D5",
}

export const commentDepthColor = (depth: number): string => {
    return colors.get(depth) ?? '#E1007D'
}

const colors = new Map<number, string>();

colors.set(0, '#EB6946');
colors.set(1, '#FA8778');
colors.set(2, '#D26E96');
colors.set(3, '#64508C');
colors.set(4, '#1E64AF');
colors.set(5, '#B91941');
colors.set(6, '#419BD2');
colors.set(7, '#69BEEB');
colors.set(8, '#D7B428');