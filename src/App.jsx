import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
import ternoImg from './assets/terno-cinza.png'

const PADRINHO = {
  suit: 'Cinza Médio',
  tie: 'Prata'
}

// CORES INDIVIDUAIS (agora usando color_name do banco)
const COLOR_MAP = {
  Vermelho: '#C1121F',
  Rubi: '#9B111E',
  Marsala: '#7B2E2F',
  Cereja: '#A1122F',

  Laranja: '#FF6B00',
  Terracota: '#E2725B',
  Salmao: '#FA8072',
  Ferrugem: '#B7410E',

  Rosa: '#FF66A3',
  Cha: '#F4C2C2',
  Fuscia: '#C72C6C',
  Coral: '#FF7F50',
  Rose: '#FF66A3',
  'Rosa Queimado': '#C08081',

  Amarelo: '#FFD60A',
  Manteiga: '#F3E5AB',
  Mostarda: '#C69C06',
  Caramelo: '#AF6E4D'
}

export default function App() {
  const [phone, setPhone] = useState('')
  const [member, setMember] = useState(null)
  const [timeLeft, setTimeLeft] = useState({})
  const [colors, setColors] = useState([])
  const [gifts, setGifts] = useState([])

  // ==========================
  // LOGIN
  // ==========================
  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error || !data) {
      alert('Telefone não autorizado')
      return
    }

    setMember(data)
  }

  // ==========================
  // CONTAGEM
  // ==========================
  useEffect(() => {
    const weddingDate = new Date('2026-06-15T18:00:00')
    const timer = setInterval(() => {
      const diff = weddingDate - new Date()
      setTimeLeft({
        dias: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        horas: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutos: Math.max(0, Math.floor((diff / (1000 * 60)) % 60))
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // ==========================
  // BUSCAR DADOS DO BANCO
  // ==========================
  useEffect(() => {
    if (!member) return

    const fetchData = async () => {
      const { data: colorData } = await supabase
        .from('dress_colors')
        .select('*')

      const { data: giftData } = await supabase
        .from('gifts')
        .select('*')

      setColors(colorData || [])
      setGifts(giftData || [])
    }

    fetchData()
  }, [member])

  // ==========================
  // ESCOLHER COR (agora usando color_name)
  // ==========================
  const chooseColor = async (colorId) => {
    if (member.role !== 'madrinha') return

    // verifica se já escolheu alguma cor
    const alreadyChosen = colors.find(c => c.selected_by === member.id)
    if (alreadyChosen) {
      alert('Você já escolheu uma cor.')
      return
    }

    await supabase
      .from('dress_colors')
      .update({ selected_by: member.id })
      .eq('id', colorId)

    const { data } = await supabase.from('dress_colors').select('*')
    setColors(data)
  }

  // ==========================
  // RESERVAR PRESENTE
  // ==========================
  const reserveGift = async (giftId) => {
    await supabase
      .from('gifts')
      .update({
        reserved: true,
        reserved_by: member.id
      })
      .eq('id', giftId)

    const { data } = await supabase.from('gifts').select('*')
    setGifts(data)
  }

  // ==========================
  // CONFIRMAR PRESENÇA
  // ==========================
  const confirmPresence = async () => {
    await supabase
      .from('members')
      .update({ confirmed: true })
      .eq('id', member.id)

    alert('Presença confirmada!')
  }

  const titleStyle = {
    fontFamily: 'Playfair Display, serif',
    letterSpacing: '1px'
  }

  // ==========================
  // TELA LOGIN
  // ==========================
  if (!member) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <h2>Área exclusiva para padrinhos e madrinhas</h2>
        <input
          placeholder="Digite seu telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: 10, width: 250 }}
        />
        <br /><br />
        <button
          onClick={handleLogin}
          style={{
            background: '#CBB8A9',
            color: '#2E2E2E',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Entrar
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: '#F9F7F4', color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>

      {/* HERO */}
      <section style={{
        height: '100vh',
        background: '#F5F1EC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <p style={{ letterSpacing: 2 }}>SAVE THE DATE</p>
        <h1 style={{ ...titleStyle, fontSize: 56 }}>Silvio & Lucimar</h1>
        <p>15 de Junho de 2026 • Anápolis - GO</p>
      </section>

      {/* CONTAGEM */}
      <section style={{
        background: '#CBB8A9',
        padding: 40,
        display: 'flex',
        justifyContent: 'center',
        gap: 40
      }}>
        {Object.entries(timeLeft).map(([k, v]) => (
          <div key={k} style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: 32 }}>{v}</strong>
            <div>{k}</div>
          </div>
        ))}
      </section>

      {/* LOCALIZAÇÃO CERIMÔNIA */}
      <section style={{ padding: 80, textAlign: 'center', background: '#EFEAE3' }}>
        <h2 style={titleStyle}>Localização da Cerimônia</h2>
        <iframe
          title="Mapa Cerimônia"
          src="https://www.google.com/maps?q=Anápolis%20GO&output=embed"
          width="80%"
          height="300"
          style={{ border: 0, borderRadius: 12, marginTop: 30 }}
          loading="lazy"
        />
      </section>

      {/* PADRINHOS */}
      <section style={{ padding: 80, textAlign: 'center' }}>
        <h2 style={titleStyle}>Padrinhos</h2>

        <img
          src={ternoImg}
          alt="Terno Cinza Médio"
          style={{
            width: 250,
            marginBottom: 30
          }}
        />

        <p>
          Traje: <strong>{PADRINHO.suit}</strong> com gravata <strong>{PADRINHO.tie}</strong>
        </p>
      </section>

      {/* MADRINHAS */}
      {member.role === 'madrinha' && (
        <section style={{ padding: 80, textAlign: 'center', background: '#F1ECE6' }}>
          <h2 style={titleStyle}>Madrinhas</h2>
          <p>Escolha sua cor</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {colors.map(color => (
              <span
                key={color.id}
                onClick={() => chooseColor(color.id)}
                style={{
                  background: COLOR_MAP[color.color_name] || '#ddd',
                  color: '#fff',
                  padding: '10px 18px',
                  borderRadius: 30,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  cursor: color.selected_by ? 'not-allowed' : 'pointer',
                  opacity: color.selected_by ? 0.4 : 1,
                  fontWeight: 500
                }}
              >
                {color.color_name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* LOCALIZAÇÃO FESTA */}
      <section style={{ padding: 80, textAlign: 'center', background: '#EFEAE3' }}>
        <h2 style={titleStyle}>Localização da Nossa Festa</h2>
        <iframe
          title="Mapa Festa"
          src="https://www.google.com/maps?q=Anápolis%20GO&output=embed"
          width="80%"
          height="300"
          style={{ border: 0, borderRadius: 12, marginTop: 30 }}
          loading="lazy"
        />
      </section>

      {/* PRESENTES */}
      <section style={{ padding: 80, textAlign: 'center' }}>
        <h2 style={titleStyle}>Lista de Presentes</h2>

        <p style={{ maxWidth: 600, margin: '20px auto' }}>
          Como já temos nossa casa montada, preferimos receber presentes em dinheiro
          para realizar nossa viagem dos sonhos.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 30,
          marginTop: 40
        }}>
          {gifts.map(gift => (
            <div key={gift.id} style={{
              background: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
            }}>
              {gift.image_url && (
                <img
                  src={gift.image_url}
                  alt={gift.name}
                  style={{
                    width: '100%',
                    height: 160,
                    objectFit: 'cover'
                  }}
                />
              )}

              <div style={{ padding: 24 }}>
                <h4>{gift.name}</h4>
                <p>R$ {gift.price}</p>
                <button
                  disabled={gift.reserved}
                  onClick={() => reserveGift(gift.id)}
                  style={{
                    background: '#A8C3B1',
                    color: '#2E2E2E',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    opacity: gift.reserved ? 0.5 : 1
                  }}
                >
                  {gift.reserved ? 'Reservado' : 'Presentear'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 60 }}>
          <button
            onClick={confirmPresence}
            style={{
              background: '#CBB8A9',
              color: '#2E2E2E',
              border: 'none',
              padding: '14px 30px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            Confirmar Presença
          </button>
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: 'center' }}>
        Silvio & Lucimar 💍
      </footer>
    </div>
  )
}
