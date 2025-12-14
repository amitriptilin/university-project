import { Routes, Route } from 'react-router-dom';
import { GradeDataProvider } from '../../context/GradeDataContext.jsx';
import Header from "../../components/header";
import GradeJournal from "../../components/GradeJournal/GradeJournal";
import PerformanceJournal from "../../components/PerformanceJournal/PerformanceJournal";

const MainPage = () => {
    return (
        <GradeDataProvider>
            <>
                <Header />
                <Routes>
                    <Route path="/" element={<GradeJournal />} />
                    <Route path="/grades" element={<GradeJournal />} />
                    <Route path="/performance" element={<PerformanceJournal />} />
                </Routes>
            </>
        </GradeDataProvider>
    )
}

export default MainPage;