import CardDashboard from "./CardDashboard"

const CardAdmin = () => {
  return (
    <div className="grid grid-cols-4 gap-5 p-2 w-full">
          <CardDashboard
            title={`Students`}
            count={1280}
            logo={`bi bi-people-fill`}
          />
          <CardDashboard
            title={`Teachers`}
            count={224}
            logo={`bi bi-person-workspace`}
          />
          <CardDashboard title={`Lessons`} count={840} logo={`bi bi-people`} />
          <CardDashboard
            title={`Class`}
            count={150}
            logo={`bi bi-currency-exchange`}
          />
        </div>
  )
}

export default CardAdmin