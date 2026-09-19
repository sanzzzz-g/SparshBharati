import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    const source = typeof body.source === 'string' ? body.source : ''
    const target = typeof body.target === 'string' ? body.target : ''
    if (!text || !source || !target) return NextResponse.json({ error: 'Text, source, and target are required.' }, { status: 400 })
    if (source === target) return NextResponse.json({ text, translated: false })
    const key = process.env.BHASHINI_API_KEY
    if (!key) return NextResponse.json({ text, translated: false, message: 'Translation service is not configured; continuing with the original text.' })
    const response = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', { method:'POST', headers:{'Content-Type':'application/json','Authorization':key}, body:JSON.stringify({ pipelineTasks:[{taskType:'translation',config:{language:{sourceLanguage:source,targetLanguage:target},serviceId:'ai4bharat/indictrans-v2-all-gpu--t4'}}], inputData:{input:[{source:text}]}}) })
    if (!response.ok) return NextResponse.json({ text, translated:false, message:'Translation was unavailable, so we kept your original text.' })
    const data = await response.json()
    const translated = data?.pipelineResponse?.[0]?.output?.[0]?.target ?? text
    return NextResponse.json({ text:translated, translated:true })
  } catch { return NextResponse.json({ error:'Please try again. Your original text is safe in the app.' }, { status:500 }) }
}
