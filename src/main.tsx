import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./integrations/supabase/client.ts";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
	<ThemeProvider defaultTheme="system">
		<SessionContextProvider supabaseClient={supabase}>
			<App />
		</SessionContextProvider>
	</ThemeProvider>
);
