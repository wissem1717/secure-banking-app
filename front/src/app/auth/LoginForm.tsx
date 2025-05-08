import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  }, [user, navigate]);

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
      <Card>
        <CardHeader>
          <CardTitle>Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="chocolatine96"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
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
                <Button type="submit" className="w-full">
                  Se connecter
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Vous n&apos;avez pas de compte ? Contactez-nous.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
