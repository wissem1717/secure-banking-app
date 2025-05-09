import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (user)
      navigate(user.role === "employee" ? "/backend/clients" : "/dashboard");
  }, [user]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const username = (formElement.elements[0] as HTMLInputElement).value;
    const password = (formElement.elements[1] as HTMLInputElement).value;

    axios
      .post("http://localhost:3000/login", {
        username,
        password,
      })
      .then((response) => {
        login(response.data);
        setError(""); // réinitialise l’erreur
        navigate(
          response.data.role === "employee"
            ? "/backend/clients"
            : "/dashboard"
        );
      })
      .catch((err) => {
        setError("Nom d'utilisateur ou mot de passe incorrect.");
        console.error(err);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6 rounded-xl border border-gray-300 py-6 shadow-sm">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6">
          <div className="leading-none font-semibold">Connection</div>
        </div>
        <div className="px-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <label htmlFor="username" className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">Nom d'utilisateur</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  className="selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  placeholder="chocolatine96"
                  required
                />
              </div>
              <div className="grid gap-3">
                <label htmlFor="password" className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  placeholder="SuperMotDePasseUwU"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full h-9 px-4 py-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">
                  Se connecter
                </button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Vous n&apos;avez pas de compte ? Contactez-nous !
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
