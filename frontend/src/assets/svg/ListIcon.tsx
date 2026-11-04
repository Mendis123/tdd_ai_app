import { Icon, type IconProps } from "./Icon.tsx";

export function ListIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
        </Icon>
    );
}
