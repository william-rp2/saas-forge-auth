import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface Props {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
	const { session, isLoading } = useSessionContext();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !session) navigate("/auth/login");
	}, [session, isLoading, navigate]);

	if (isLoading) {
		return <div>Carregando sessão...</div>;
	}

	if (!session) {
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
