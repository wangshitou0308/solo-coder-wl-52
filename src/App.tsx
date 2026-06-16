import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Letters from "@/pages/Letters";
import LetterDetail from "@/pages/LetterDetail";
import LetterEdit from "@/pages/LetterEdit";
import Contacts from "@/pages/Contacts";
import ContactDetail from "@/pages/ContactDetail";
import Postcards from "@/pages/Postcards";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/letters" element={<Letters />} />
          <Route path="/letters/new" element={<LetterEdit />} />
          <Route path="/letters/:id" element={<LetterDetail />} />
          <Route path="/letters/:id/edit" element={<LetterEdit />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/:contactId" element={<ContactDetail />} />
          <Route path="/map" element={<Postcards />} />
          <Route path="/postcards" element={<Postcards />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/other"
            element={
              <div className="text-center text-xl py-20">
                Other Page - Coming Soon
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
