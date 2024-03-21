import React, { useEffect, useState } from "react";
import "./Agendar.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createClient } from "@supabase/supabase-js";
import Horarios from "./Horarios";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_ANON_KEY
);

function Agendamentos() {
  const [agendamento, setAgendamento] = React.useState({
    reserva: true,
    date: "", // Aqui armazenaremos a data selecionada
    apartamento: "",
    horario: "",
  });

  const [horariosDisponiveis, setHorariosDisponiveis] = React.useState([]);
  const [horariosAgendados, setHorariosAgendados] = React.useState([]);
  const [apartamento, setApartamento] = React.useState("");
  const [date, setDate] = React.useState(new Date()); // Modificamos para armazenar apenas um objeto de data
  const [buscaApartamento, setBuscaApartamento] = React.useState("");
  const [agendamentosPorApartamento, setAgendamentosPorApartamento] =
    React.useState([]);
  const handleDateChange = (newDate) => {
    const formattedDate = newDate.toISOString().split("T")[0];
    setDate(newDate); // Atualiza o estado do date com a nova data selecionada
    setAgendamento({ ...agendamento, date: formattedDate }); // Atualiza o estado do agendamento com a nova data formatada
  };

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

  const createAgendamento = async () => {
    const { data, error } = await supabase.from("agendamento").insert([
      {
        reserva: agendamento.reserva,
        date: agendamento.date,
        apartamento: agendamento.apartamento,
        horario: agendamento.horario,
      },
    ]);
    console.log(data, error);
  };
  const handleAgendamento = () => {
    // Verificando se foi selecionado um horário
    if (!agendamento.horario) {
      alert("Por favor, selecione um horário.");
      return;
    }

    // Enviando o agendamento para ser salvo
    createAgendamento();

    window.location.reload();
  };

  return (
    <div className="agendamentos">
      <div className="realizar-agendamento">
        <h3>Realização de Agendamento</h3>
        <hr />
      </div>
      <div className="agendamento">
        <div className="info-agendamento">
          <div className="">
            <Calendar
              className={"calendario"}
              onChange={handleDateChange}
              value={date}
              minDetail="year"
            />
          </div>
          <input
            className="input-apartamento"
            type="text"
            placeholder="Apartamento"
            onChange={(e) =>
              setAgendamento({
                ...agendamento,
                apartamento: e.target.value,
              })
            }
          />
          <div>
            <h3>Horários Disponíveis</h3>
            <select
              className="select-horario"
              onChange={(e) =>
                setAgendamento({ ...agendamento, horario: e.target.value })
              }
            >
              <option value="">Selecione um horário</option>
              {horariosDisponiveis.map((horario) => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>
          <button className="botao-agendar" onClick={handleAgendamento}>
            Agendar
          </button>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Agendamentos;
