import { render, screen } from '@testing-library/react'
import VehicleCard from '@/components/vehicle-card'

describe('VehicleCard', () => {
  it('renders vehicle information correctly', () => {
    const vehicle = {
      id: '1',
      title: 'Test Vehicle',
      description: 'This is a test vehicle',
      price: 10000,
      type: 'car' as const,
    }

    render(<VehicleCard {...vehicle} />)

    expect(screen.getByText('Test Vehicle')).toBeInTheDocument()
    expect(screen.getByText('10000 €')).toBeInTheDocument()
    expect(screen.getByText('Voiture')).toBeInTheDocument()
  })
})