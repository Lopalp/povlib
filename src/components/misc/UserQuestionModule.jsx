"use client";

import React, { useState } from "react";
import { X, HelpCircle } from "lucide-react";
import SurveyModal from "../modals/SurveyModal";
import SingleQuestion from "./SingleQuestion";

const UserQuestionModule = ({ mode, useCase, onSubmit }) => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [singleAnswer, setSingleAnswer] = useState("");

  // Text und Konfigurationen je Use-Case
  const useCaseConfig = {
    feedback: {
      title: "Alpha-Feedback",
      description: "Hilf uns, die Alpha-Version zu verbessern.",
      // Fragen, Tabs etc. für Survey
      surveyTabs: [
        {
          key: "general",
          label: "Allgemein",
          fields: [
            {
              name: "erwartungen",
              label: "Was erwartest du von der App?",
              type: "text",
            },
            {
              name: "zufriedenheit",
              label: "Wie zufrieden bist du (1–5)?",
              type: "number",
            },
          ],
        },
        {
          key: "bugs",
          label: "Bugs & Probleme",
          fields: [
            {
              name: "gefunden",
              label: "Hast du Bugs gefunden?",
              type: "radio",
              options: ["Ja", "Nein"],
            },
            {
              name: "bugBeschreibung",
              label: "Beschreibe den Bug",
              type: "textarea",
            },
          ],
        },
      ],
      singleQuestion: {
        questionText: "Gibt es aktuell etwas, das dich besonders stört?",
        type: "text",
      },
    },
    support: {
      title: "Support-Ticket",
      description: "Ordne dein Support-Anliegen ein.",
      surveyTabs: [
        {
          key: "art",
          label: "Art des Problems",
          fields: [
            {
              name: "kategorie",
              label: "Kategorie wählen",
              type: "select",
              options: ["Technisch", "Abrechnung", "Sonstiges"],
            },
            {
              name: "priorität",
              label: "Dringlichkeit",
              type: "radio",
              options: ["Hoch", "Mittel", "Niedrig"],
            },
          ],
        },
        {
          key: "details",
          label: "Details",
          fields: [
            {
              name: "beschreibung",
              label: "Beschreibe dein Problem",
              type: "textarea",
            },
            { name: "anhang", label: "Screenshot (optional)", type: "file" },
          ],
        },
      ],
      singleQuestion: {
        questionText:
          "Handelt es sich um ein wiederkehrendes Problem? (Ja/Nein)",
        type: "radio",
        options: ["Ja", "Nein"],
      },
    },
    profile: {
      title: "Profil erweitern",
      description:
        "Ergänze dein Profil, damit wir dich besser unterstützen können.",
      surveyTabs: [
        {
          key: "personal",
          label: "Persönlich",
          fields: [
            { name: "vorname", label: "Vorname", type: "text" },
            { name: "nachname", label: "Nachname", type: "text" },
          ],
        },
        {
          key: "interessen",
          label: "Interessen",
          fields: [
            { name: "hobbys", label: "Hobbys", type: "text" },
            {
              name: "fachgebiete",
              label: "Fachgebiete",
              type: "select",
              options: ["Design", "Entwicklung", "Marketing", "Management"],
            },
          ],
        },
      ],
      singleQuestion: {
        questionText: "Möchtest du eine kurze Bio hinzufügen? (Ja/Nein)",
        type: "radio",
        options: ["Ja", "Nein"],
      },
    },
  };

  const cfg = useCaseConfig[useCase] || useCaseConfig.profile;

  // Handler für Single-Question Übermittlung
  const handleSingleSubmit = () => {
    // Gibt answer und useCase zurück
    onSubmit && onSubmit({ useCase, answer: singleAnswer });
    setSingleAnswer("");
  };

  return (
    <>
      <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{cfg.title}</h2>
          <button
            onClick={() => setIsSurveyOpen(true)}
            className="text-gray-400 hover:text-gray-200"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-300 mb-6">{cfg.description}</p>

        {mode === "survey" ? (
          <button
            onClick={() => setIsSurveyOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition"
          >
            Umfrage starten
          </button>
        ) : (
          <div className="space-y-4">
            <label className="block text-gray-200 font-medium">
              {cfg.singleQuestion.questionText}
            </label>
            {cfg.singleQuestion.type === "radio" ? (
              <div className="flex gap-4">
                {cfg.singleQuestion.options.map((opt) => (
                  <label
                    key={opt}
                    className="inline-flex items-center gap-1 text-gray-200"
                  >
                    <input
                      type="radio"
                      name="singleQuestion"
                      value={opt}
                      checked={singleAnswer === opt}
                      onChange={(e) => setSingleAnswer(e.target.value)}
                      className="form-radio h-4 w-4 text-yellow-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={singleAnswer}
                onChange={(e) => setSingleAnswer(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Deine Antwort"
              />
            )}
            <button
              onClick={handleSingleSubmit}
              disabled={!singleAnswer}
              className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${
                singleAnswer
                  ? "bg-yellow-500 text-black hover:bg-yellow-600 transition"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              Absenden
            </button>
          </div>
        )}
      </div>

      <SurveyModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        tabs={cfg.surveyTabs}
        useCase={useCase}
        onSubmit={(data) => {
          onSubmit && onSubmit({ useCase, surveyData: data });
          setIsSurveyOpen(false);
        }}
      />
    </>
  );
};

export default UserQuestionModule;
