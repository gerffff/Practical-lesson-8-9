import { useState, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import type { FunctionComponent } from "../common/types";
import FieldsListPage from "../routes/fields";
import CropsListPage from "../routes/crops";
import FieldWorksListPage from "../routes/field-works";

export const Home = (): FunctionComponent => {
	const [activeTab, setActiveTab] = useState<'fields' | 'crops' | 'field-works'>('fields');
	const location = useLocation();

	// Определяем активную вкладку на основе URL
	useEffect(() => {
		const path = location.pathname;
		if (path.startsWith('/fields')) {
			setActiveTab('fields');
		} else if (path.startsWith('/crops')) {
			setActiveTab('crops');
		} else if (path.startsWith('/field-works')) {
			setActiveTab('field-works');
		} else {
			setActiveTab('fields');
		}
	}, [location.pathname]);

	return (
		<>
			{activeTab === 'fields' && <FieldsListPage />}
			{activeTab === 'crops' && <CropsListPage />}
			{activeTab === 'field-works' && <FieldWorksListPage />}
		</>
	);
};
