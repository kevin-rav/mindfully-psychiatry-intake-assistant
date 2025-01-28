import { redirect } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";
import { getSession, commitSession } from "~/utils/sessions";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent } from "~/components/ui/card";

const adminPassword = process.env.ADMIN_PASSWORD;

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const enteredPassword = formData.get("password");
  const redirectTo = formData.get("redirectTo") || "/";

  if (enteredPassword === adminPassword) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("adminAuthenticated", true);
    return redirect(redirectTo as string, {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  return { error: "Invalid password" };
}

export default function PasswordPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <h3 className="text-xl font-semibold">Admin Access</h3>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
