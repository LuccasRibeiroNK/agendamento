import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./Agendar.css";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_ANON_KEY
);

function Horarios() {
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horariosAgendados, setHorariosAgendados] = useState([]);

  useEffect(() => {
    async function fetchHorarios() {
      const { data, error } = await supabase
        .from("agendamento")
        .select("horario");

      if (error) {
        console.error("Erro ao buscar horários agendados:", error.message);
        return;
      }

      const horariosAgendados = data.map((agendamento) => agendamento.horario);
      setHorariosAgendados(horariosAgendados);

      const horariosPadrao = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
      ];

      const horariosDisponiveis = horariosPadrao.filter(
        (horario) => !horariosAgendados.includes(horario)
      );
      setHorariosDisponiveis(horariosDisponiveis);
    }

    fetchHorarios();
  }, []);

  return (
    <div className="titulo">
      <h3>Listagem de Agendamentos</h3>
      <hr />
      <div className="horarios-container">
        <div className="coluna">
          <h3>Horários Disponíveis:</h3>
          {/* Exibir os horários disponíveis */}
          {horariosDisponiveis.map((horario) => (
            <div key={horario} className="horario-disponivel">
              {horario}
            </div>
          ))}
        </div>
        <div className="coluna">
          <h3>Horários Agendados:</h3>
          {/* Exibir os horários agendados */}
          {horariosAgendados.map((horario) => (
            <div key={horario} className="horario-agendado">
              {horario}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Horarios;
