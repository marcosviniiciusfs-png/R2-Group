import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import {
  ArrowDown, ArrowLeft, ArrowRight, Building2, CarFront, Check,
  CircleDollarSign, Clock3, Home, Landmark, LockKeyhole,
  Menu, ShieldCheck, Sparkles, TrendingUp, UserRound, X,
  MapPin, Mail, Phone, MessageCircle,
} from 'lucide-react'
import logo from '../Logo.jpeg'

const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/553498706663'
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/r2_group_ofc'
const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/profile.php?id=61582081132980&locale=pt_BR'

const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r=".8" fill="currentColor" stroke="none"/></svg>
const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.7 21v-8h2.8l.42-3.2H13.7V7.75c0-.93.26-1.56 1.62-1.56h1.73V3.33c-.3-.04-1.33-.13-2.53-.13-2.5 0-4.22 1.53-4.22 4.34V9.8H7.47V13h2.83v8h3.4Z"/></svg>

type FormData = {
  objetivo: string; valor: number; prazo: string; entrada: number; parcela: number;
  nome: string; whatsapp: string; cidade: string
}

const goals = [
  { value: 'Imóvel', label: 'Meu imóvel', icon: Home },
  { value: 'Veículo', label: 'Meu veículo', icon: CarFront },
  { value: 'Investimento', label: 'Investir', icon: TrendingUp },
  { value: 'Capital', label: 'Capital para negócio', icon: Building2 },
]
const creditOptions = [
  { label: 'Até R$ 100 mil', detail: 'Para um valor menor', value: 100000, icon: CircleDollarSign },
  { label: 'R$ 100 mil a R$ 250 mil', detail: 'Uma faixa intermediária', value: 250000, icon: Landmark },
  { label: 'R$ 250 mil a R$ 500 mil', detail: 'Para um objetivo maior', value: 500000, icon: Building2 },
  { label: 'Acima de R$ 500 mil', detail: 'Para valores mais altos', value: 750000, icon: TrendingUp },
]
const entryOptions = [
  { label: 'Até R$ 5 mil', detail: 'Tenho pouco separado agora', badge: 'Até 5k', value: 5000 },
  { label: 'R$ 5 mil a R$ 15 mil', detail: 'Tenho uma reserva inicial', badge: '5–15k', value: 15000 },
  { label: 'R$ 15 mil a R$ 40 mil', detail: 'Tenho uma entrada maior', badge: '15–40k', value: 40000 },
  { label: 'Acima de R$ 40 mil', detail: 'Consigo separar mais de R$ 40 mil', badge: '40k+', value: 80000 },
]
const installmentOptions = [
  { label: 'Até R$ 1 mil', detail: 'Uma parcela mais leve', badge: 'Até 1k', value: 1000 },
  { label: 'R$ 1 mil a R$ 3 mil', detail: 'Uma faixa intermediária', badge: '1–3k', value: 3000 },
  { label: 'R$ 3 mil a R$ 6 mil', detail: 'Posso investir um pouco mais por mês', badge: '3–6k', value: 6000 },
  { label: 'Acima de R$ 6 mil', detail: 'Busco acelerar minha conquista', badge: '6k+', value: 10000 },
]
const timingOptions = [
  { label: 'O quanto antes', detail: 'Quero começar logo', badge: 'Agora' },
  { label: 'De 3 a 6 meses', detail: 'Quero me organizar primeiro', badge: '3–6m' },
  { label: 'De 6 a 12 meses', detail: 'Estou planejando com calma', badge: '6–12m' },
  { label: 'Mais de 1 ano', detail: 'Ainda estou avaliando as opções', badge: '12m+' },
]
const contemplatedClients = [
  '/clientes/video-01.mp4',
  '/clientes/video-02.mp4',
  '/clientes/video-03.mp4',
  '/clientes/video-04.mp4',
  '/clientes/video-05.mp4',
  '/clientes/video-06.mp4',
]
const fade = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: .75, ease: [0.16, 1, 0.3, 1] as const } } }

function App() {
  const [menu, setMenu] = useState(false)
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<FormData>({ objetivo: '', valor: 0, prazo: '', entrada: 0, parcela: 0, nome: '', whatsapp: '', cidade: '' })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: .075, smoothWheel: true, wheelMultiplier: 1 })
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [])

  const goTo = (id: string) => {
    setMenu(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const valid = useMemo(() => {
    if (step === 0) return Boolean(data.objetivo)
    if (step === 1) return data.valor > 0
    if (step === 2) return data.entrada > 0
    if (step === 3) return data.parcela > 0
    if (step === 4) return Boolean(data.prazo)
    return data.nome.trim().length > 0 && data.whatsapp.replace(/\D/g, '').length >= 10 && data.cidade.trim().length > 2
  }, [data, step])

  const maskPhone = (value: string) => {
    const n = value.replace(/\D/g, '').slice(0, 11)
    if (n.length <= 2) return n
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`
    return `(${n.slice(0, 2)}) ${n.slice(2, n.length === 11 ? 7 : 6)}-${n.slice(n.length === 11 ? 7 : 6)}`
  }

  const submit = async () => {
    setLoading(true); setError('')
    const endpoint = import.meta.env.VITE_LEAD_ENDPOINT || 'https://r2-group-lead-api.marcosviniicius-fs.workers.dev'
    try {
      if (!endpoint) throw new Error('O canal de atendimento está em configuração. Tente novamente em breve.')
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, origem: 'simulador_r2_group', received_at: new Date().toISOString(), source_url: window.location.href }) })
      if (!response.ok) throw new Error('Não foi possível enviar agora.')
      setSent(true)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Algo saiu do previsto. Tente novamente em instantes.') }
    finally { setLoading(false) }
  }

  return (
    <main>
      <header className="header">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="R2 Group, início">
          <img src={logo} alt="R2 Group" /><span>R2 <b>GROUP</b></span>
        </button>
        <nav className={menu ? 'nav open' : 'nav'}>
          <button onClick={() => goTo('simulador')}>Simulador</button>
          <button onClick={() => goTo('vantagens')}>Por que a R2</button>
          <button onClick={() => goTo('faq')}>Dúvidas</button>
        </nav>
        <a className="header-cta whatsapp-header" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Falar no WhatsApp</a>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Abrir menu">{menu ? <X /> : <Menu />}</button>
      </header>

      <section className="hero">
        <div className="orb orb-one" /><div className="orb orb-two" />
        <div className="hero-grid" aria-hidden="true" />
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={fade}>
          <span className="eyebrow"><span /> Inteligência para o seu próximo passo</span>
          <h1>Seu objetivo merece<br />uma <em>estratégia.</em></h1>
          <p>Conte seus planos. A R2 Group organiza as informações para entender o cenário ideal para você.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => goTo('simulador')}>Começar simulação <ArrowRight size={18} /></button>
            <span><ShieldCheck size={18} /> Seus dados protegidos</span>
          </div>
        </motion.div>
        <motion.div className="hero-mark" initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: .15 }}>
          <div className="logo-halo" /><img src={logo} alt="" />
          <div className="floating-stat stat-a"><span><TrendingUp size={16} /></span><div><small>PLANEJAMENTO</small><strong>Sob medida</strong></div></div>
          <div className="floating-stat stat-b"><span><LockKeyhole size={16} /></span><div><small>PROCESSO</small><strong>Seguro e simples</strong></div></div>
        </motion.div>
        <button className="scroll-cue" onClick={() => goTo('simulador')}><span>DESCUBRA</span><ArrowDown size={17} /></button>
      </section>

      <section className="sim-section" id="simulador">
        <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .4 }} variants={fade}>
          <span className="kicker">SIMULAÇÃO PERSONALIZADA</span>
          <h2>Vamos transformar intenção<br />em um plano possível.</h2>
          <p>Leva menos de 2 minutos. Sem compromisso.</p>
        </motion.div>

        <motion.div className="sim-card" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={fade}>
          {!sent ? <>
            <div className="progress-top"><span>ETAPA {step + 1} DE 6</span><strong>{['Seu objetivo', 'Valor desejado', 'Entrada disponível', 'Parcela mensal', 'Prazo', 'Seus dados'][step]}</strong></div>
            <div className="progress"><i style={{ width: `${((step + 1) / 6) * 100}%` }} /></div>
            <div className="form-body">
              <AnimatePresence mode="wait">
                <motion.div className="step" key={step} initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0)' }} exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} transition={{ duration: .3 }}>
                  {step === 0 && <>
                    <div className="step-icon"><Sparkles /></div><h3>O que você quer conquistar?</h3><p className="step-sub">Escolha o objetivo que mais combina com o seu momento.</p>
                    <div className="goal-grid">{goals.map(item => <button key={item.value} className={data.objetivo === item.value ? 'goal selected' : 'goal'} onClick={() => setData({ ...data, objetivo: item.value })}><item.icon /><span>{item.label}</span><i>{data.objetivo === item.value && <Check size={14} />}</i></button>)}</div>
                  </>}
                  {step === 1 && <>
                    <div className="step-icon"><CircleDollarSign /></div><h3>Qual valor você está buscando?</h3><p className="step-sub">Pode ser aproximado. Escolha a faixa mais próxima.</p>
                    <div className="choice-stack">{creditOptions.map(item => <button key={item.value} className={data.valor === item.value ? 'choice-card selected' : 'choice-card'} onClick={() => setData({ ...data, valor: item.value })}><span className="choice-icon"><item.icon /></span><span className="choice-copy"><strong>{item.label}</strong><small>{item.detail}</small></span><i>{data.valor === item.value && <Check size={14} />}</i></button>)}</div>
                  </>}
                  {step === 2 && <>
                    <div className="step-icon"><Landmark /></div><h3>Quanto você consegue separar de entrada?</h3><p className="step-sub">Escolha uma faixa que faça sentido hoje.</p>
                    <div className="choice-stack">{entryOptions.map(item => <button key={item.value} className={data.entrada === item.value ? 'choice-card selected' : 'choice-card'} onClick={() => setData({ ...data, entrada: item.value })}><span className="choice-icon"><Landmark /></span><span className="choice-copy"><strong>{item.label}</strong><small>{item.detail}</small></span><b className="choice-badge">{item.badge}</b></button>)}</div>
                  </>}
                  {step === 3 && <>
                    <div className="step-icon"><CircleDollarSign /></div><h3>Qual parcela mensal fica ideal para você?</h3><p className="step-sub">Marque a faixa que cabe melhor no seu planejamento.</p>
                    <div className="choice-stack">{installmentOptions.map(item => <button key={item.value} className={data.parcela === item.value ? 'choice-card selected' : 'choice-card'} onClick={() => setData({ ...data, parcela: item.value })}><span className="choice-icon"><CircleDollarSign /></span><span className="choice-copy"><strong>{item.label}</strong><small>{item.detail}</small></span><b className="choice-badge">{item.badge}</b></button>)}</div>
                  </>}
                  {step === 4 && <>
                    <div className="step-icon"><Clock3 /></div><h3>Quando você pretende realizar?</h3><p className="step-sub">Escolha o prazo mais próximo do seu momento.</p>
                    <div className="choice-stack">{timingOptions.map(item => <button key={item.label} className={data.prazo === item.label ? 'choice-card selected' : 'choice-card'} onClick={() => setData({ ...data, prazo: item.label })}><span className="time-chip">{item.badge}</span><span className="choice-copy"><strong>{item.label}</strong><small>{item.detail}</small></span><i>{data.prazo === item.label && <Check size={14} />}</i></button>)}</div>
                  </>}
                  {step === 5 && <>
                    <div className="step-icon"><UserRound /></div><h3>Para quem preparamos esta análise?</h3><p className="step-sub">Preencha seus dados para receber um atendimento direcionado.</p>
                    <div className="contact-fields"><label><span>Nome completo</span><input autoComplete="name" placeholder="Como podemos chamar você?" value={data.nome} onChange={e => setData({ ...data, nome: e.target.value })} /></label><div className="field-row"><label><span>WhatsApp</span><input inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" value={data.whatsapp} onChange={e => setData({ ...data, whatsapp: maskPhone(e.target.value) })} /></label><label><span>Cidade</span><input autoComplete="address-level2" placeholder="Onde você mora?" value={data.cidade} onChange={e => setData({ ...data, cidade: e.target.value })} /></label></div></div>
                    <p className="privacy"><LockKeyhole size={13} /> Seus dados serão usados apenas para este atendimento.</p>
                    {error && <p className="error">{error}</p>}
                  </>}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="form-footer"><button className="back" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={17} /> Voltar</button><button className="next" disabled={!valid || loading} onClick={() => step < 5 ? setStep(step + 1) : submit()}>{loading ? 'Enviando...' : step === 5 ? 'Receber minha análise' : 'Continuar'} {!loading && <ArrowRight size={17} />}</button></div>
          </> : <motion.div className="success" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}><div className="success-icon"><Check /></div><span className="kicker">SIMULAÇÃO CONCLUÍDA</span><h3>Obrigado, {data.nome.split(' ')[0]}.</h3><p>Recebemos suas informações. O próximo passo é uma conversa para entender os detalhes do seu objetivo.</p><button className="primary" onClick={() => { setSent(false); setStep(0) }}>Fazer nova simulação</button></motion.div>}
        </motion.div>
        <div className="trust-row"><span><LockKeyhole /> Ambiente seguro</span><span><Clock3 /> Resposta rápida</span><span><ShieldCheck /> Sem compromisso</span></div>
      </section>

      <section className="contemplados" aria-labelledby="contemplados-title">
        <motion.div className="contemplados-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={fade}>
          <div><span className="kicker">CONQUISTAS R2</span><h2 id="contemplados-title">Clientes contemplados.<br /><em>Planos que saíram do papel.</em></h2></div>
          <p>Histórias reais de clientes que avançaram com a R2 Group e transformaram seus planos em conquistas.</p>
        </motion.div>
        <div className="contemplados-grid">
          {contemplatedClients.map((video, index) => (
            <motion.article key={video} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ delay: (index % 3) * .1, duration: .65 }}>
              <div className="contemplado-visual"><video src={video} controls preload="metadata" playsInline aria-label={`Cliente contemplado ${index + 1}`} /><span>{String(index + 1).padStart(2, '0')}</span><i>R2 GROUP</i></div>
              <div className="contemplado-copy"><small>CLIENTE CONTEMPLADO</small><h3>Mais uma conquista R2</h3><span>História real de quem tirou o plano do papel</span></div>
            </motion.article>
          ))}
        </div>
        <button className="contemplados-cta" onClick={() => goTo('simulador')}>Quero começar a minha história <ArrowRight size={17} /></button>
      </section>

      <section className="proof" id="vantagens">
        <motion.div className="proof-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={fade}>
          <span className="kicker">POR QUE A R2 GROUP</span><h2>Clareza para decidir.<br /><em>Estratégia</em> para avançar.</h2><p>Cada plano começa com uma boa leitura do momento atual. Nosso processo organiza as informações e torna a conversa mais objetiva.</p>
          <div className="signature"><span>R2</span><div><strong>Resultados. Estratégia.</strong><small>Crescimento.</small></div></div>
        </motion.div>
        <div className="benefit-list">
          {[['01', 'Análise personalizada', 'Seu objetivo e seu momento orientam todo o atendimento.'], ['02', 'Caminho descomplicado', 'Perguntas diretas, informações claras e próximos passos bem definidos.'], ['03', 'Atendimento humano', 'Uma conversa de verdade para avaliar possibilidades com você.']].map(([n,t,d]) => <motion.article key={n} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .5 }} variants={fade}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><ArrowRight /></motion.article>)}
        </div>
      </section>

      <section className="process">
        <span className="kicker">COMO FUNCIONA</span><h2>Simples do início ao próximo passo.</h2>
        <div className="process-grid">{[[Sparkles,'Você simula','Conte seu objetivo e o cenário que está considerando.'],[Landmark,'A R2 analisa','As informações ajudam a preparar um atendimento mais assertivo.'],[UserRound,'A gente conversa','Você recebe o contato para conhecer os caminhos possíveis.']].map(([Icon,title,desc], i) => { const I = Icon as typeof Sparkles; return <article key={title as string}><small>0{i+1}</small><div><I /></div><h3>{title as string}</h3><p>{desc as string}</p></article> })}</div>
        <button className="primary" onClick={() => goTo('simulador')}>Quero fazer minha simulação <ArrowRight size={18} /></button>
      </section>

      <section className="faq" id="faq">
        <div><span className="kicker">DÚVIDAS FREQUENTES</span><h2>Antes de começar,<br />vale saber.</h2></div>
        <div className="accordion">{[['A simulação tem algum custo?','Não. Você pode preencher o simulador sem custo e sem compromisso.'],['Preciso decidir alguma coisa agora?','Não. O formulário serve para entender seu objetivo e preparar uma conversa mais direcionada.'],['Quanto tempo leva para preencher?','Em geral, menos de dois minutos. São três etapas curtas.'],['Meus dados ficam seguros?','As informações são usadas para viabilizar o atendimento solicitado.']].map(([q,a], i) => <details key={q} open={i===0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>
      </section>

      <section className="final-cta"><div className="final-grid" /><img src={logo} alt="" /><div><span className="kicker">O PRÓXIMO PASSO COMEÇA AQUI</span><h2>Planos grandes pedem<br /><em>decisões inteligentes.</em></h2><button className="primary" onClick={() => goTo('simulador')}>Simular agora <ArrowRight size={18} /></button></div></section>
      <footer id="contato">
        <div className="footer-main">
          <div className="footer-about"><div className="footer-brand"><img src={logo} alt="R2 Group" /><span>R2 <b>GROUP</b></span></div><p>Estratégia e atendimento para ajudar você a organizar o próximo passo.</p><div className="footer-social"><a href={INSTAGRAM_URL} target={INSTAGRAM_URL.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a><a href={FACEBOOK_URL} target={FACEBOOK_URL.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a></div></div>
          <div className="footer-column"><span className="footer-title">CONTATO</span><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Phone /> (34) 9870-6663</a><a href="mailto:"><Mail /> E-mail a confirmar</a></div>
          <div className="footer-column"><span className="footer-title">ONDE ESTAMOS</span><div><MapPin /> <span>Endereço comercial<br /><small>A confirmar</small></span></div></div>
          <div className="footer-action"><span className="footer-title">FALE COM A R2</span><p>Quer conversar sobre seu objetivo?</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle /> Chamar no WhatsApp <ArrowRight /></a></div>
        </div>
        <div className="footer-bottom"><p>Resultados <i /> Estratégia <i /> Crescimento</p><small>© {new Date().getFullYear()} R2 Group. Todos os direitos reservados.</small></div>
      </footer>
    </main>
  )
}

export default App
