import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { PiUsersThreeLight } from "react-icons/pi";
import { IoMailOpenOutline } from "react-icons/io5";
import { IoFlashOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";

import LogoTheNews from '../image.png';
import Loader from '../Loader/Loader';


import './Dashboard.css'

const filteringStatus = [
    { value: 'Ativo', label: "Streaks ativos" },
    { value: 'Inativo', label: "Streaks inativos" }
];

const filteringNewsletters = [
    { value: "post_123456", label: "Newsletter - Edição #1" },
    { value: "post_123457", label: "Newsletter - Edição #2" },
    { value: "post_123458", label: "Newsletter - Edição #3" },
    { value: "post_123459", label: "Newsletter - Edição #4" },
    { value: "post_123460", label: "Newsletter - Edição #5" },
];

 const filteringPeriod = [
  { value: 168, label: "Últimos 7 dias" },  // 7 dias * 24 horas
  { value: 360, label: "Últimos 15 dias" }, // 15 dias * 24 horas
  { value: 480, label: "Últimos 20 dias" }, // 20 dias * 24 horas
  { value: 600, label: "Últimos 25 dias" }, // 25 dias * 24 horas
  { value: 720, label: "Últimos 30 dias" }  // 30 dias * 24 horas
];

  const Dashboard = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [dropdownStatusOpen, setDropdownStatusOpen] = useState<boolean>(false);
    const [selectedNewsletter, setSelectedNewsletter] = useState<string | null>(null);
    const [dropdownNewsletterOpen, setDropdownNewsletterOpen] = useState<boolean>(false);
    const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
    const [dropdownPeriodOpen, setDropdownPeriodOpen] = useState<boolean>(false);
    

    const handleStatusChange = (value: string) => {
      setSelectedStatus(value);
      setDropdownStatusOpen(false); // Fecha o dropdown após selecionar
      console.log("Status selecionado:", value);
    };

    const handleNewsletterChange = (value: string) => {
      setSelectedNewsletter(value);
      setDropdownNewsletterOpen(false); // Fecha o dropdown após selecionar
      console.log("Newsletter selecionada:", value);
    };

    const handlePeriodChange = (value: number) => {
      setSelectedPeriod(value);
      setDropdownPeriodOpen(false); // Fecha o dropdown após selecionar
      console.log("Período selecionado:", value);
    };

    const enableBtnFilter = selectedStatus || selectedNewsletter ||selectedPeriod;
    //const [error, setError] = useState("");
  
    const getData = async () => {
      try {
        setLoading(true);
    
        // Garante que os filtros sempre tenham um valor padrão
        const period = selectedPeriod ?? 720; // Padrão: Últimos 30 dias
        const streakStatus = selectedStatus ?? "Ativo"; // Padrão: Streaks ativos
        const newsletterId = selectedNewsletter ?? ""; // Se não houver, não passa
    
        // Obtém o token do localStorage com segurança
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }
    
        // Monta os parâmetros da URL
        const queryParams = new URLSearchParams({
          period: String(period),
          streakStatus: String(streakStatus),
        });
    
        // Adiciona o `newsletterId` apenas se estiver definido
        if (newsletterId) {
          queryParams.append("newsletterId", newsletterId);
        }
    
        const response = await axios.get(
          `https://the-news-api.joaopedrobraga-07.workers.dev/admin/dashboard?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
    
        setData(response.data);
        console.log("Dados recebidos:", response.data);
        return response.data;
      } catch (error: any) {
        console.error(" Erro ao buscar dados do dashboard:", error);
    
        // Captura mensagens detalhadas da API, se disponíveis
        if (error.response) {
          console.error("Detalhes do erro:", error.response.data);
        }
    
        return null; // Retorna `null` para evitar quebra do código ao usar os dados
      } finally {
        setLoading(false); // Garante que o estado de carregamento seja atualizado sempre
      }
    };
    
    useEffect(() => {
      getData()
      
    }, []);
  
    if (loading) return (
    <div className='loader__box'>
      <Loader/>
    </div>
    );
  
    return (
        <div className='main__dashboard'>
            <div className='header__dashboard'>
                <div className='section__logo__header'>
                    <div className='img__box__dashboard'>
                        <img className='img__logo' src={LogoTheNews} alt="" />
                    </div>
                    <div className='text__header__das'>
                        <p style={{ fontSize: "16px" }}>the news</p>
                        <p style={{ fontSize: "12px", color: 'gray' }}>Painel Administrativo</p>
                    </div>
                    
                </div>
                </div>
            
            {/* Seção de Métricas */}
            <div className='section__metrics'>
                <div className='inner__metrics'>
                    <PiUsersThreeLight className='icon__metrics'/>

                    <h3>{data.totalUsers}</h3>
                    <p className='span__metrics'>Usuários</p>
                </div>
                <div className='inner__metrics'>
                        <IoMailOpenOutline className='icon__metrics'/>
                        <h3>{data.openNewsletters}</h3>
                        <p className='span__metrics'>Aberturas de Newsletters</p>

                </div>
                <div className='inner__metrics'>
                    <IoFlashOutline className='icon__metrics'/>
                    <h3>{data.avgStreaks}</h3>
                    <p className='span__metrics'>Média de Streaks</p>
                </div>
                <div className='inner__metrics'>
                    <IoCalendarOutline />
                    <h3>{data.retentionRate}</h3>
                    <p className='span__metrics'>Taxa de Rentenção</p>
                </div>
                
            </div>

            <div className='section__filter'>
              <div className='inner__filter' onClick={() => setDropdownStatusOpen(!dropdownStatusOpen)}>
                <IoFlashOutline className='icon__filter'/>
                <input
                  type="text"
                  className="input__filter"
                  placeholder={selectedStatus ? filteringStatus.find(p => p.value === selectedStatus)?.label : "Selecione um status"}
                  readOnly
                  
                />
                
                <div className='dropsown__status'>
                  {dropdownStatusOpen && (
                    <div className="dropdown__status">
                      {filteringStatus.map((option) => (
                        <div key={option.value} className="value__status" onClick={() => handleStatusChange(option.value)}>
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className='inner__filter'>
                <IoMailOpenOutline className='icon__filter'/>
                <input
                  type="text"
                  className="input__filter"
                  placeholder={
                    selectedNewsletter
                      ? filteringNewsletters.find(p => p.value === selectedNewsletter)?.label
                      : "Selecione uma edição"
                  }
                  readOnly
                  onClick={() => setDropdownNewsletterOpen(!dropdownNewsletterOpen)}
                />
                
                {dropdownNewsletterOpen && (
                  <div className="dropdown__newsletters">
                    {filteringNewsletters.map((option) => (
                      <div key={option.value} className="value__newsletters" onClick={() => handleNewsletterChange(option.value)}>
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='inner__filter' onClick={() => setDropdownPeriodOpen(!dropdownPeriodOpen)}>
                <GoClock className='icon__filter'/>
                <input
                  type="text"
                  className="input__filter"
                  placeholder={selectedPeriod ? filteringPeriod.find(p => p.value === selectedPeriod)?.label : "Selecione um período"}
                  readOnly
                />
                

                {dropdownPeriodOpen && (
                  <div className="dropdown__period">
                    {filteringPeriod.map((option) => (
                      <div key={option.value} className='value__period' onClick={() => handlePeriodChange(option.value)}>
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className={enableBtnFilter ? 'btn__filter__enable':'btn__filter__disable'} onClick={getData}>
                Filtrar
              </button>
            </div>

            <div className='section__grafics__and__ranking'>
              {/* Gráfico de Engajamento */}
              <div className='box__grafics'>
                  <h3 style={{textAlign: "center", margin: "5px"}}>Engajamento ao longo do tempo</h3>
                  <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                          width={500}
                          height={400}
                          data={data.engagementData}
                          margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0,
                          }}
                          >
                          
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" 
                            dataKey="Usuários" 
                            stroke="rgb(255, 207, 0)"  
                            fill="rgb(255, 207, 0)" 
                            strokeWidth={2}  
                            dot={{ fill: "rgb(255, 207, 0)", stroke: "white", strokeWidth: 1, r: 3 }} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>

              {/* Ranking dos Usuários */}
              <div className='box__ranking'>
                  <h3 style={{textAlign: "center", margin: "5px"}}>
                      Top 10 Usuários Mais Engajados
                  </h3>
                  <ul>
                  {data.topUsers.map((user: any, index: number) => (
                      <div key={index} className='inner__user'>
                          {index + 1}. {user.email} - <IoFlashOutline className='icon__metrics'/> {user.streak} dias
                      </div>
                  ))}
                  </ul>
              </div>
            </div>
        </div>
    );
  };
  
  export default Dashboard;