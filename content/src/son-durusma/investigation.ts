import { all, cmp, v } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { cikarim, dil, hts, ifade, tel } from './inv-docs.js';
import { aksam1, aksam2, dayEnd, gece, geceSon, hub, leyla } from './inv-hub.js';
import {
  gorusme,
  gorusmeGiris,
  kemal,
  kemalGiris,
  kemalKarar,
  nuri,
  suleyman,
  suleymanKarar,
  tarik1,
} from './inv-people.js';
import { ev, evGiris, mutfak, mutfakGiris, ofis } from './inv-places.js';

// 50-investigation: birinci soruşturma evresi (3 gün × 3 EP). Parçalar inv-*.ts dosyalarında.

export const investigation: CasePart = {
  nodes: [
    hub,
    dayEnd,
    aksam1,
    aksam2,
    leyla,
    ofis,
    mutfakGiris,
    mutfak,
    nuri,
    tarik1,
    evGiris,
    ev,
    gorusmeGiris,
    gorusme,
    suleyman,
    suleymanKarar,
    kemalGiris,
    kemal,
    kemalKarar,
    ifade,
    hts,
    tel,
    dil,
    cikarim,
    ...gece,
    geceSon,
  ],
  triggers: [
    {
      id: 'tg_day_end',
      scope: 'INV_HUB',
      priority: 1,
      when: all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', 3)),
      goto: 'INV_DAY_END',
    },
  ],
};
