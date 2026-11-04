import { Icon, type IconProps } from "./Icon.tsx";

export function TrashIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M4 7h16M10 11v6M14 11v6" />
            <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
            <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </Icon>
    );
}
