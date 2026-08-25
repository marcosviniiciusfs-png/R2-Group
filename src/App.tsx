import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import {
  ArrowDown, ArrowLeft, ArrowRight, Building2, CarFront, Check,
  ChevronDown, CircleDollarSign, Clock3, Home, Landmark, LockKeyhole,
  Menu, ShieldCheck, Sparkles, TrendingUp, UserRound, X,
  MapPin, Mail, Phone, MessageCircle,
} from 'lucide-react'
import logo from '../Logo.jpeg'

const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/'
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || '#contato'
const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL || '#contato'

const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r=".8" fill="currentColor" stroke="none"/></svg>
const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.7 21v-8h2.8l.42-3.2H13.7V7.75c0-.93.26-1.56 1.62-1.56h1.73V3.33c-.3-.04-1.33-.13-2.53-.13-2.5 0-4.22 1.53-4.22 4.34V9.8H7.47V13h2.83v8h3.4Z"/></svg>

type FormData = {
  objetivo: string; valor: number; prazo: string; entrada: string; parcela: number;
  nome: string; whatsapp: string; cidade: string
}

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const goals = [
  { value: 'Imóvel', label: 'Meu imóvel', icon: Home },
  { value: 'Veículo', label: 'Meu veículo', icon: CarFront },
  { value: 'Investimento', label: 'Investir', icon: TrendingUp },
  { value: 'Capital', label: 'Capital para negócio', icon: Building2 },
]
const fade = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: .75, ease: [0.16, 1, 0.3, 1] as const } } }

function App() {
  const [menu, setMenu] = useState(false)
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<FormData>({ objetivo: '', valor: 250000, prazo: '', entrada: '', parcela: 500, nome: '', whatsapp: '', cidade: '' })

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
    if (step === 1) return data.valor >= 30000 && Boolean(data.prazo) && Boolean(data.entrada) && data.parcela >= 500
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
    const endpoint = import.meta.env.VITE_LEAD_ENDPOINT
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
            <div className="progress-top"><span>ETAPA {step + 1} DE 3</span><strong>{['Seu objetivo', 'Seu cenário', 'Seus dados'][step]}</strong></div>
            <div className="progress"><i style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>
            <div className="form-body">
              <AnimatePresence mode="wait">
                <motion.div className="step" key={step} initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0)' }} exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} transition={{ duration: .3 }}>
                  {step === 0 && <>
                    <div className="step-icon"><Sparkles /></div><h3>O que você quer conquistar?</h3><p className="step-sub">Escolha o objetivo que mais combina com o seu momento.</p>
                    <div className="goal-grid">{goals.map(item => <button key={item.value} className={data.objetivo === item.value ? 'goal selected' : 'goal'} onClick={() => setData({ ...data, objetivo: item.value })}><item.icon /><span>{item.label}</span><i>{data.objetivo === item.value && <Check size={14} />}</i></button>)}</div>
                  </>}
                  {step === 1 && <>
                    <div className="step-icon"><CircleDollarSign /></div><h3>Qual valor aproxima você desse objetivo?</h3><p className="step-sub">Ajuste a estimativa e conte um pouco sobre o momento da compra.</p>
                    <div className="value-display"><small>VALOR DESEJADO</small><strong>{money.format(data.valor)}</strong></div>
                    <input className="range" type="range" min="30000" max="2000000" step="10000" value={data.valor} onChange={e => setData({ ...data, valor: Number(e.target.value) })} />
                    <div className="range-labels"><span>R$ 30 mil</span><span>R$ 2 milhões</span></div>
                    <div className="field-row timing-row"><label><span>Quando pretende realizar?</span><select value={data.prazo} onChange={e => setData({ ...data, prazo: e.target.value })}><option value="">Selecione</option><option>O quanto antes</option><option>De 3 a 6 meses</option><option>De 6 a 12 meses</option><option>Mais de 1 ano</option></select><ChevronDown /></label><label><span>Possui valor de entrada?</span><select value={data.entrada} onChange={e => setData({ ...data, entrada: e.target.value })}><option value="">Selecione</option><option>Sim</option><option>Não</option><option>Ainda estou avaliando</option></select><ChevronDown /></label></div>
                    <div className="financial-ranges">
                      <label className="mini-range"><span><small>Qual a parcela mensal ideal para você?</small><strong>{money.format(data.parcela)}</strong></span><input className="range" type="range" min="500" max="20000" step="500" value={data.parcela} onChange={e => setData({ ...data, parcela: Number(e.target.value) })} /><i><b>R$ 500</b><b>R$ 20 mil</b></i></label>
                    </div>
                  </>}
                  {step === 2 && <>
                    <div className="step-icon"><UserRound /></div><h3>Para quem preparamos esta análise?</h3><p className="step-sub">Preencha seus dados para receber um atendimento direcionado.</p>
                    <div className="contact-fields"><label><span>Nome completo</span><input autoComplete="name" placeholder="Como podemos chamar você?" value={data.nome} onChange={e => setData({ ...data, nome: e.target.value })} /></label><div className="field-row"><label><span>WhatsApp</span><input inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" value={data.whatsapp} onChange={e => setData({ ...data, whatsapp: maskPhone(e.target.value) })} /></label><label><span>Cidade</span><input autoComplete="address-level2" placeholder="Onde você mora?" value={data.cidade} onChange={e => setData({ ...data, cidade: e.target.value })} /></label></div></div>
                    <p className="privacy"><LockKeyhole size={13} /> Seus dados serão usados apenas para este atendimento.</p>
                    {error && <p className="error">{error}</p>}
                  </>}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="form-footer"><button className="back" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={17} /> Voltar</button><button className="next" disabled={!valid || loading} onClick={() => step < 2 ? setStep(step + 1) : submit()}>{loading ? 'Enviando...' : step === 2 ? 'Receber minha análise' : 'Continuar'} {!loading && <ArrowRight size={17} />}</button></div>
          </> : <motion.div className="success" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}><div className="success-icon"><Check /></div><span className="kicker">SIMULAÇÃO CONCLUÍDA</span><h3>Obrigado, {data.nome.split(' ')[0]}.</h3><p>Recebemos suas informações. O próximo passo é uma conversa para entender os detalhes do seu objetivo.</p><button className="primary" onClick={() => { setSent(false); setStep(0) }}>Fazer nova simulação</button></motion.div>}
        </motion.div>
        <div className="trust-row"><span><LockKeyhole /> Ambiente seguro</span><span><Clock3 /> Resposta rápida</span><span><ShieldCheck /> Sem compromisso</span></div>
      </section>

      <section className="contemplados" aria-labelledby="contemplados-title">
        <motion.div className="contemplados-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }} variants={fade}>
          <div><span className="kicker">CONQUISTAS R2</span><h2 id="contemplados-title">Clientes contemplados.<br /><em>Planos que saíram do papel.</em></h2></div>
          <p>Este espaço reúne as histórias de quem avançou com a R2 Group. Novos registros serão adicionados conforme os materiais oficiais forem disponibilizados.</p>
        </motion.div>
        <div className="contemplados-grid">
          {[
            { n: '01', title: 'Uma nova conquista', type: 'História de cliente' },
            { n: '02', title: 'Um plano realizado', type: 'Resultado R2' },
            { n: '03', title: 'O próximo capítulo', type: 'Pode ser o seu' },
          ].map((item, index) => (
            <motion.article key={item.n} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ delay: index * .1, duration: .65 }}>
              <div className="contemplado-visual"><img src={logo} alt="" /><span>{item.n}</span><i>R2 GROUP</i></div>
              <div className="contemplado-copy"><small>{item.type}</small><h3>{item.title}</h3><span>Conteúdo oficial em atualização</span></div>
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
          <div className="footer-column"><span className="footer-title">CONTATO</span><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><Phone /> Telefone a confirmar</a><a href="mailto:"><Mail /> E-mail a confirmar</a></div>
          <div className="footer-column"><span className="footer-title">ONDE ESTAMOS</span><div><MapPin /> <span>Endereço comercial<br /><small>A confirmar</small></span></div></div>
          <div className="footer-action"><span className="footer-title">FALE COM A R2</span><p>Quer conversar sobre seu objetivo?</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle /> Chamar no WhatsApp <ArrowRight /></a></div>
        </div>
        <div className="footer-bottom"><p>Resultados <i /> Estratégia <i /> Crescimento</p><small>© {new Date().getFullYear()} R2 Group. Todos os direitos reservados.</small></div>
      </footer>
    </main>
  )
}

export default App
