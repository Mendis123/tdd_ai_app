import { Icon, type IconProps } from "./Icon.tsx";

export function ChevronLeftIcon(props: IconProps) {
    return (
        <Icon {...props}>
            <path d="m15 6-6 6 6 6" />
        </Icon>
    );
}
