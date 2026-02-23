import { createContainer, asFunction, asClass } from 'awilix'
import { useEffect } from 'react'

// Domain - Entities
import { EstablishmentEntity } from '../domain/entities/establishment.entity'
import { EventEntity } from '../domain/entities/event.entity'
import { CategoryEntity, QuartierEntity } from '../domain/entities/category.entity'
import { StatsEntity } from '../domain/entities/stats.entity'

// Infrastructure - Controllers
import { establishmentController } from '../infrastructure/controller/establishment.controller'
import { eventController } from '../infrastructure/controller/event.controller'
import { categoryController } from '../infrastructure/controller/category.controller'

// Infrastructure - Presenters
import { establishmentPresenter } from '../infrastructure/presenters/establishment.presenter'
import { eventPresenter } from '../infrastructure/presenters/event.presenter'
import { categoryPresenter } from '../infrastructure/presenters/category.presenter'

// UserInterface - ViewModels
import { homeViewModel } from '../userinterface/pages/home/viewModel/homeViewModel'
import { explorerViewModel } from '../userinterface/pages/explorer/viewModel/explorerViewModel'
import { establishmentDetailViewModel } from '../userinterface/pages/establishments/viewModel/establishmentDetailViewModel'
import { eventsViewModel } from '../userinterface/pages/events/viewModel/eventsViewModel'
import { eventDetailViewModel } from '../userinterface/pages/events/viewModel/eventDetailViewModel'
import { carteViewModel } from '../userinterface/pages/carte/viewModel/carteViewModel'

const DI = createContainer()

DI.register({
  // Framework
  useEffect: asFunction(() => useEffect).transient(),

  // ViewModels
  homeViewModel: asFunction(homeViewModel).transient(),
  explorerViewModel: asFunction(explorerViewModel).transient(),
  establishmentDetailViewModel: asFunction(establishmentDetailViewModel).transient(),
  eventsViewModel: asFunction(eventsViewModel).transient(),
  eventDetailViewModel: asFunction(eventDetailViewModel).transient(),
  carteViewModel: asFunction(carteViewModel).transient(),

  // Infrastructure - Controllers
  establishmentController: asFunction(establishmentController).transient(),
  eventController: asFunction(eventController).transient(),
  categoryController: asFunction(categoryController).transient(),

  // Infrastructure - Presenters
  establishmentPresenter: asFunction(establishmentPresenter).transient(),
  eventPresenter: asFunction(eventPresenter).transient(),
  categoryPresenter: asFunction(categoryPresenter).transient(),

  // Domain - Entities
  EstablishmentEntity: asClass(EstablishmentEntity).transient(),
  EventEntity: asClass(EventEntity).transient(),
  CategoryEntity: asClass(CategoryEntity).transient(),
  QuartierEntity: asClass(QuartierEntity).transient(),
  StatsEntity: asClass(StatsEntity).transient(),
})

export default DI
