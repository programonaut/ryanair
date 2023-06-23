import * as client from '~/client.ts'
import { getCheapestPerDay, getCheapestRoundTrip, getDailyFaresInRange } from '~/fares/index.ts'
import { isAfterISO, nextMonth, tomorrow } from '~/helpers/date.ts'

describe('fares', () => {
  describe('getCheapestPerDay', () => {
    it('when provided with all parameters \n\t Then should call the correct API URL', async () => {
      expect.assertions(1)
      const getSpy = vi.spyOn(client, 'get')
      const from = 'BER' // Berlin airport
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const currency = 'EUR'
      await getCheapestPerDay(from, to, startDate, currency)

      expect(getSpy).toHaveBeenCalledWith(
        `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${from}/${to}/cheapestPerDay?outboundMonthOfDate=${startDate}&currency=${currency}`
      )
    })

    it('when provided with all parameters \n\t Then should be able to retrieve data and parse it', async () => {
      expect.assertions(1)
      const from = 'BER' // Berlin airport
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const currency = 'EUR'

      const data = await getCheapestPerDay(from, to, startDate, currency)
      expect(data.outbound.fares.length).toBeGreaterThan(0)
    })

    it('when asked for info on non existing airport \n\t Then should throw HTTP error', async () => {
      const from = 'WRONG_IATA_CODE'
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const currency = 'EUR'

      await expect(getCheapestPerDay(from, to, startDate, currency)).rejects.toThrow('Response code 400 (Bad Request)')
    })
  })

  describe('getDailyFaresInRange', () => {
    it('when provided with all parameters \n\t Then should call the correct API URL', async () => {
      expect.assertions(1)
      const getSpy = vi.spyOn(client, 'get')
      const from = 'BER' // Berlin airport
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const endDate = tomorrow()
      const currency = 'EUR'

      const [year, month] = startDate.split('-')
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const firstDayOfMonth = `${year}-${month}-01`

      await getDailyFaresInRange(from, to, startDate, endDate, currency)

      expect(getSpy).toHaveBeenCalledWith(
        `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${from}/${to}/cheapestPerDay?outboundMonthOfDate=${firstDayOfMonth}&currency=${currency}`
      )
    })

    it('when provided with all parameters \n\t Then should be able to retrieve data and parse it', async () => {
      expect.assertions(1)
      const from = 'BER' // Berlin airport
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const endDate = nextMonth()
      const currency = 'EUR'

      const data = await getDailyFaresInRange(from, to, startDate, endDate, currency)
      expect(data.length).toBeGreaterThan(0)
    })

    it('when provided with all parameters \n\t Then should not have any nullish prices', async () => {
      expect.assertions(1)
      const from = 'BER' // Berlin airport
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const endDate = nextMonth()
      const currency = 'EUR'

      const data = await getDailyFaresInRange(from, to, startDate, endDate, currency)
      expect(data.every((fare) => fare.price !== null)).toBeTruthy()
    })
  })

  describe('getCheapestRoundTrip', () => {
    it('when provided with all parameters \n\t Then should call the correct API URL', async () => {
      expect.assertions(1)
      const getSpy = vi.spyOn(client, 'get')
      const from = 'BER' // Berlin airport
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const endDate = tomorrow()
      const currency = 'EUR'

      const [year, month] = startDate.split('-')
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const firstDayOfMonth = `${year}-${month}-01`

      await getCheapestRoundTrip(from, to, startDate, endDate, currency)

      expect(getSpy).toHaveBeenCalledWith(
        `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${from}/${to}/cheapestPerDay?outboundMonthOfDate=${firstDayOfMonth}&currency=${currency}`
      )
    })

    it('when provided with all parameters \n\t Then should be able to retrieve data and parse it', async () => {
      expect.assertions(1)
      const from = 'BER' // Berlin airport
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const endDate = nextMonth()
      const currency = 'EUR'

      const data = await getCheapestRoundTrip(from, to, startDate, endDate, currency)
      expect(data.length).toBeGreaterThan(0)
    })

    it('when provided with all parameters \n\t Then should not have any nullish prices', async () => {
      expect.assertions(2)
      const from = 'BER' // Berlin airport
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const endDate = nextMonth()
      const currency = 'EUR'

      const data = await getCheapestRoundTrip(from, to, startDate, endDate, currency)
      expect(data.every((trip) => trip.departure.price !== null)).toBeTruthy()
      expect(data.every((trip) => trip.return.price !== null)).toBeTruthy()
    })

    it('when provided with all parameters \n\t Then should have return trips after departure', async () => {
      expect.assertions(1)
      const from = 'BER' // Berlin airport
      const to = 'KRK' // Krakow airport
      const startDate = tomorrow()
      const endDate = nextMonth()
      const currency = 'EUR'

      const data = await getCheapestRoundTrip(from, to, startDate, endDate, currency)
      expect(data.every((trip) => isAfterISO(trip.return.day, trip.departure.day))).toBeTruthy()
    })
  })
})
