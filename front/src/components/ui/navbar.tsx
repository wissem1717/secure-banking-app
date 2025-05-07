import { cn } from "@/lib/utils";

interface NavbarProps {
    title: string,
}

const activeLinkStyle = "text-black-700 text-sm font-bold";
const inactiveLinkStyle = "text-gray-700 hover:text-indigo-700 text-sm font-medium";
const linkStyleTrigger = function ({ isActive, isPending }: { isActive: boolean, isPending: boolean }) { return ((isPending || isActive) ? activeLinkStyle : inactiveLinkStyle)};

function Navbar({ children, ...props }: React.PropsWithChildren<NavbarProps>) {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white border-b backdrop-blur-lg bg-opacity-80">
    <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 ">
        <div className="relative flex h-16 justify-between">
            <div className="flex justify-start">
                <div className="flex flex-shrink-0 items-center">
                    <img className="block h-12 w-auto" src="/logo.jpg" />
                </div>
                <p className="flex flex-shrink-0 items-center m-2">
                    {props.title}
                </p>
            </div>
            <div className="flex flex-1">
                { children }
            </div>
        </div>
    </div>
    </div>
  )
}

function NavbarLeft({ children }: {children?: React.ReactNode | undefined}) {
    return (
        <div className="flex-1 flex px-2 py-3 items-center space-x-8 justify-left">
            {children}
        </div>
    )
}

function NavbarRight({ children }: {children?: React.ReactNode | undefined}) {
    return (
        <div className="flex-shrink-0 flex px-2 py-3 items-center space-x-8 justify-end">
            {children}
        </div>
    )
}

function NavbarRightButton({ children, className, ...props }: React.PropsWithChildren<React.ComponentProps<"button">>) {
    return (
        <button className={cn("text-gray-800 bg-indigo-100 hover:bg-indigo-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ", className)} {...props}>
            {children}
        </button>
    )
}

export {
    Navbar,
    NavbarLeft,
    NavbarRight,
    NavbarRightButton,
    activeLinkStyle,
    inactiveLinkStyle,
    linkStyleTrigger
}
