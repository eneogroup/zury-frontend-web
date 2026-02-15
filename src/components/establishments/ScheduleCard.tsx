interface ScheduleCardProps {
  schedule?: {
    day: string;
    hours: string;
    isToday?: boolean;
  }[];
}

export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  const defaultSchedule = [
    { day: 'Lundi', hours: '08h-23h', isToday: false },
    { day: 'Mardi', hours: '08h-23h', isToday: false },
    { day: 'Mercredi', hours: '08h-23h', isToday: true },
    { day: 'Jeudi', hours: '08h-23h', isToday: false },
    { day: 'Vendredi', hours: '08h-23h', isToday: false },
    { day: 'Samedi', hours: '08h-23h', isToday: false },
    { day: 'Dimanche', hours: '10h-22h', isToday: false },
  ];

  const displaySchedule = schedule || defaultSchedule;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold text-dark mb-4">Horaires</h3>
      <div className="space-y-2">
        {displaySchedule.map((item) => (
          <div
            key={item.day}
            className={`flex justify-between py-2 ${
              item.isToday ? 'bg-light rounded px-3 font-semibold' : ''
            }`}
          >
            <span className="text-dark">
              {item.day} {item.isToday && '(Aujourd\'hui)'}
            </span>
            <span className="text-gray">{item.hours}</span>
          </div>
        ))}
      </div>
    </div>
  );
}