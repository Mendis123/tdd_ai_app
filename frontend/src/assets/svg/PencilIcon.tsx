import { Icon, type IconProps } from "./Icon.tsx";

export function PencilIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="M16.5 4.5a2.12 2.12 0 0 1 3 3L8 19l-4 1 1-4z" />
            <path d="m14.5 6.5 3 3" />
        </Icon>
    );
}
