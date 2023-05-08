# Airports API

Source code: [`source/airports/`](../source/airports/)

- [Airports API](#airports-api)
  - [getActive()](#getactive)
  - [getClosest()](#getclosest)
  - [getDestinations(code: IataCode)](#getdestinationscode-iatacode)
  - [getInfo(code: IataCode)](#getinfocode-iatacode)
  - [searchByPhrase(phrase: string, locale = 'en-gb')](#searchbyphrasephrase-string-locale--en-gb)
  - [searchByRoute(from: string, to = '', locale = 'en-gb')](#searchbyroutefrom-string-to---locale--en-gb)

## <code>getActive()</code>

Retrieves a list of all active airports.

**Returns: `Promise<Airport[]>`**

```typescript
import { airports } from '@2bad/ryanair'

const airports = await airports.getClosest()
```

## <code>getClosest()</code>

Returns information about the closest airport based on the user's IP address.

**Returns: `Promise<AirportShort>`**

```typescript
import { airports } from '@2bad/ryanair'

const airport = await airports.getClosest()
```

## <code>getDestinations(code: IataCode)</code>

Returns a list of available destinations from an airport.

- **code: IataCode** - The IATA code of the airport.

**Returns: `Promise<Destination[]>`**

```typescript
import { airports } from '@2bad/ryanair'

const destinations = await airports.getDestinations('BER')
```

## <code>getInfo(code: IataCode)</code>

Returns information about an airport.

**code: IataCode** - The IATA code of the airport.

**Returns: `Promise<Airport>`**

```typescript
import { airports } from '@2bad/ryanair'

const info = await airports.getInfo('BER')
```

## <code>searchByPhrase(phrase: string, locale = 'en-gb')</code>

Searches for airports matching the given phrase.

- **phrase: string** - The search phrase to use when looking up airports.
- **locale: string** (optional, defaults to 'en-gb') - The locale to use when looking up airports.

**Returns: `Promise<AirportShort[]>`**

```typescript
import { airports } from '@2bad/ryanair'

const airports = await airports.searchByPhrase('Berlin')
```

## <code>searchByRoute(from: string, to = '', locale = 'en-gb')</code>

Searches for airports with available routes from the departure phrase to the arrival phrase.

- **from: string** - The starting location to use when looking up routes. This can be an airport name, city, or country.
- **to: string** (optional, defaults to '') - The landing location to use when looking up routes. This can be an airport name, city, or country.
- **locale: string** (optional, defaults to 'en-gb') - The locale to use when looking up routes.

**Returns: `Promise<AirportConnection[]>`**

```typescript
import { airports } from '@2bad/ryanair'

const from = 'Berlin'
const to = 'Paris'
const locale = 'fr-fr'

const airports = await airports.searchByRoute(from, to, locale)
```