import React, { useEffect, useState } from "react";
import "./Agendar.css";
import { createClient } from "@supabase/supabase-js";
import Agendamentos from "./Agendamentos";
import Horarios from "./Horarios";
import { ImCalendar } from "react-icons/im";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_ANON_KEY
);

function Agendar() {
  const [buscaApartamento, setBuscaApartamento] = useState("");
  const [agendamentosPorApartamento, setAgendamentosPorApartamento] = useState(
    []
  );
  const [todosAgendamentos, setTodosAgendamentos] = useState([]);

  useEffect(() => {
    async function getAgendamentosPorApartamento() {
      const { data, error } = await supabase
        .from("agendamento")
        .select("*")
        .eq("apartamento", buscaApartamento);

      if (error) {
        console.error("Erro ao buscar agendamentos:", error.message);
        return;
      }

      setAgendamentosPorApartamento(data);
    }

    if (buscaApartamento) {
      getAgendamentosPorApartamento();
    }
  }, [buscaApartamento]);

  useEffect(() => {
    async function getAllAgendamentos() {
      const { data, error } = await supabase.from("agendamento").select("*");

      if (error) {
        console.error("Erro ao buscar agendamentos:", error.message);
        return;
      }

      setTodosAgendamentos(data);
    }

    getAllAgendamentos();
  }, []);

  const handleExcluirAgendamento = async (id) => {
    const { data, error } = await supabase
      .from("agendamento")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir agendamento:", error.message);
      return;
    }

    // Atualiza a lista de agendamentos apenas para o apartamento buscado
    setAgendamentosPorApartamento(
      agendamentosPorApartamento.filter((agendamento) => agendamento.id !== id)
    );
  };

  return (
    <div>
      <div className="container">
        <div className="meus-agendamentos">
          <div className="calendar">
            <div>
              <ImCalendar />
            </div>
            <div>
              <h3>Agendamentos</h3>
            </div>
          </div>
          <div className="titulo">
            <h2>Meus Agendamentos - Apartamento {buscaApartamento}</h2>
            <hr />
            {buscaApartamento && (
              <div className="horarios-agendados">
                {agendamentosPorApartamento.map((agendamento) => (
                  <div key={agendamento.id} className="agendamento-cadastrado">
                    <p>
                      <strong>Data:</strong>{" "}
                      {new Date(agendamento.date).toLocaleDateString("pt-BR")}
                    </p>
                    <p>
                      <strong>Horário:</strong> {agendamento.horario}
                    </p>
                    <p>
                      <strong>Apartamento:</strong> {agendamento.apartamento}
                    </p>

                    <div className="realizar-agendamento">
                      <p>
                        <button
                          onClick={() =>
                            handleExcluirAgendamento(agendamento.id)
                          }
                        >
                          Excluir
                        </button>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="text"
                placeholder="Apartamento"
                value={buscaApartamento}
                onChange={(e) => setBuscaApartamento(e.target.value)}
              />
              <button type="submit">Buscar Agendamentos</button>
            </form>
            <hr />
          </div>
          <div>
            <Agendamentos />
          </div>
          <div>
            <Horarios />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Agendar;
