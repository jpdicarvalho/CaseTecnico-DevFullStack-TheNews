import { useState, useEffect } from 'react';
import axios from 'axios';
import {  AreaChart, Area, CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { PiUsersThreeLight } from "react-icons/pi";
import { IoMailOpenOutline } from "react-icons/io5";
import { IoFlashOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { IoInformationCircleOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";

import LogoTheNews from '../image.png';

import './Dashboard.css'

  const data2 = [
    {
      name: '',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

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
    { value: 24, label: "Últimas 24 horas" },
    { value: 48, label: "Últimos 2 dias" },
    { value: 72, label: "Últimos 3 dias" },
    { value: 168, label: "Últimos 7 dias" },
    { value: 336, label: "Últimos 14 dias" },
    { value: 720, label: "Últimos 30 dias" },
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
        const response = await axios.get("https://the-news-api.joaopedrobraga-07.workers.dev/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pegando o token armazenado no localStorage
            "Content-Type": "application/json",
          },
        });
        setLoading(false);
        setData(response.data);
        console.log("Dados recebidos:", response.data);
        return response.data; // Retorna os dados para serem usados no state
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    };
    useEffect(() => {
      getData()
      
    }, []);
  
    if (loading) return <p>Carregando...</p>;
  
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
            <div className='information__metrics'>
                <IoInformationCircleOutline className='icon__IoInformationCircleOutline'/>
            </div>

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

              <button className={enableBtnFilter ? 'btn__filter__enable':'btn__filter__disable'}>
                Filtrar
              </button>
            </div>

            <div className='section__grafics'>
                {/* Gráfico de Engajamento */}
                <div className='box__grafics'>
                    <h3>Distribuição de streaks</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.ranking}>
                            <XAxis dataKey="email" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="streak" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='box__grafics'>
                    <h3>Engajamento ao longo do tempo</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            width={500}
                            height={400}
                            data={data2}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
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
    );
  };
  
  export default Dashboard;