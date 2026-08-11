import { memo } from 'react'

const statLabels = {
  hp: 'HP',
  atk: 'Attack',
  def: 'Defense',
  spe_atk: 'Sp. Atk',
  spe_def: 'Sp. Def',
  spd: 'Speed'
}

const getStatColor = (value) => {
  const max = 200
  const percent = Math.min(1, Math.max(0, value / max))
  const r = Math.round(255 * (1 - percent))
  const g = Math.round(255 * percent)
  return `rgb(${r}, ${g}, 0)`
}

const PkmnData = ({ pokemon }) => {
  return (
    <div className="pokemon-detail">
      <div className="pokemon-header">
        <h2 className="pokemon-name">{pokemon.name}</h2>

        <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
      </div>

      <div className='pokemon-section'>
        <div className='img-container'>
          <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
        </div>

        <div className="data-container">
          <div className="data-grid">
            <div className="grid-label">Type:</div>

            <div className="grid-value types-value">
              {pokemon.types.map(type => (
                <span key={type} className={`type-badge type-${type}`}>
                  {type}
                </span>
              ))}
            </div>

            <div className="grid-label">Body:</div>

            <div className="grid-value body-value">
              <span>
                {pokemon.height / 10} m
              </span>

              <span>
                {pokemon.weight / 10} kg
              </span>
            </div>

            <div className="grid-label">Abilities:</div>

            <div className="grid-value abilities-value">
              {pokemon.abilities.map(ability => (
                <span key={ability} className="ability-chip">
                  {ability}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2 className="stats-title">Base Stats:</h2>
                
        <div className="stats-grid">
          {Object.entries(pokemon.stats).map(([key, value]) => (
            <div key={key} className="stat-item">
              <span className="stat-name">
                {statLabels[key] || key.toUpperCase()}
              </span>

              <span className="stat-value" style={{ color: getStatColor(value) }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='audio-section'>
        <h2 className='title-cry'>Cry:</h2>

        <audio key={pokemon.id} controls className='pkmn-cry'>
          <source src={pokemon.cry} type='audio/ogg'></source>
          The audio element is not supported.
        </audio>
      </div>
    </div>
  )
}

export default memo(PkmnData)