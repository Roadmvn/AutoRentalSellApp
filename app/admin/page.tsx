'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('chart.js/auto'), { ssr: false })
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false })
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false })

// ... rest of the component code ...