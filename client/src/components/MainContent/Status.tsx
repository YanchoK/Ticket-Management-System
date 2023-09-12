import FormatStatus from "../utils/FormatStatus";

export default function Status(params) {
    const statusType = params.statusType;
    const statusValue = params.statusValue;

    function classNames<T extends string>(...classes: T[]) {
        return classes.filter(Boolean).join(' ')
    }

    const PriorityColors = {
        "CRITICAL": {
            bg: 'bg-red-200/60  dark:bg-gray-800',
            text: 'text-red-500'
        },
        "HIGH": {
            bg: 'bg-amber-200/50  dark:bg-gray-800',
            text: 'text-rose-500'
        },
        "MODERATE": {
            bg: 'bg-yellow-100/60  dark:bg-gray-800',
            text: 'text-yellow-500'
        },
        "LOW": {
            bg: 'bg-sky-100/60  dark:bg-gray-800',
            text: 'text-sky-500'
        }
    }

    const StateColors = {
        "NEW": {
            bg: 'bg-fuchsia-100/60  dark:bg-gray-800',
            text: 'text-fuchsia-500'
        },
        "IN_PROGRESS": {
            bg: 'bg-blue-100/60  dark:bg-gray-800',
            text: 'text-blue-500'
        },
        "REVIEW": {
            bg: 'bg-cyan-100/60  dark:bg-gray-800',
            text: 'text-cyan-500'
        },
        "DONE": {
            bg: 'bg-lime-200/60  dark:bg-gray-800',
            text: 'text-green-500'
        }
    }

    let bg:string
    let text:string
    switch (statusType) {
        case 'priority':
            bg = PriorityColors[statusValue].bg
            text = PriorityColors[statusValue].text
            break;
        case 'state':
            bg = StateColors[statusValue].bg
            text = StateColors[statusValue].text
            break;
        default:
            break;
    }

    return (
        <div className={classNames(bg, "inline-flex items-center px-3 py-1 rounded-full gap-x-2")}>
            <h2 className={classNames(text, "text-sm font-medium")}>{FormatStatus(statusValue)}</h2>
        </div>
    )
}