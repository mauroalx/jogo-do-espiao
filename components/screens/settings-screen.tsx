'use client'

import { useMemo } from 'react'
import {
  Button,
  Checkbox,
  InlineNotification,
  NumberInput,
  Slider,
  Stack,
  Tile,
  Toggle,
} from '@carbon/react'
import { ArrowLeft } from '@carbon/icons-react'
import { useGame } from '@/components/game-provider'
import { maxSpies } from '@/lib/game'
import { getCategoryNames } from '@/lib/word-bank'

export function SettingsScreen() {
  const { players, settings, updateSettings, goTo } = useGame()
  const categories = useMemo(() => getCategoryNames(), [])

  const limit = maxSpies(Math.max(players.length, 3))
  const selected =
    settings.enabledCategories.length > 0 ? settings.enabledCategories : categories

  const toggleCategory = (category: string, checked: boolean) => {
    const next = checked
      ? [...selected, category]
      : selected.filter((item) => item !== category)
    updateSettings({ enabledCategories: next.length === 0 ? [] : next })
  }

  return (
    <div className="screen">
      <header className="screen__head">
        <p className="screen__eyebrow">Configuração</p>
        <h1 className="screen__title">Regras da mesa</h1>
        <p className="screen__lead">
          Vale para todas as próximas rodadas. Fica salvo neste aparelho.
        </p>
      </header>

      <Stack gap={6}>
        <Tile className="setting">
          <NumberInput
            id="spy-count"
            label="Quantidade de espiões"
            helperText={`Máximo de ${limit} para ${Math.max(players.length, 3)} jogadores`}
            min={1}
            max={limit}
            step={1}
            value={Math.min(settings.spyCount, limit)}
            onChange={(_event, { value }) => {
              const parsed = Number(value)
              if (!Number.isFinite(parsed)) return
              updateSettings({
                spyCount: Math.min(Math.max(1, parsed), limit),
              })
            }}
          />
        </Tile>

        <Tile className="setting">
          <Toggle
            id="spies-know"
            labelText="Espiões se conhecem"
            labelA="Não sabem quem é o parceiro"
            labelB="Veem os outros espiões"
            toggled={settings.spiesKnowEachOther}
            onToggle={(checked) => updateSettings({ spiesKnowEachOther: checked })}
          />
        </Tile>

        <Tile className="setting">
          <Toggle
            id="one-spy-eliminates-team"
            labelText="Um espião derruba a equipe"
            labelA="Precisa encontrar todos"
            labelB="Um acerto elimina todos"
            toggled={settings.oneSpyEliminatesTeam}
            onToggle={(checked) =>
              updateSettings({ oneSpyEliminatesTeam: checked })
            }
          />
        </Tile>

        <Tile className="setting">
          <Toggle
            id="spy-hint"
            labelText="Dica para o espião"
            labelA="Sem dica nenhuma"
            labelB="Recebe uma dica vaga"
            toggled={settings.spyGetsHint}
            onToggle={(checked) => updateSettings({ spyGetsHint: checked })}
          />
        </Tile>

        <Tile className="setting">
          <Toggle
            id="show-category"
            labelText="Mostrar categoria para todos"
            labelA="Categoria escondida do espião"
            labelB="Todos veem a categoria"
            toggled={settings.showCategoryToEveryone}
            onToggle={(checked) =>
              updateSettings({ showCategoryToEveryone: checked })
            }
          />
        </Tile>

        <Tile className="setting">
          <Toggle
            id="spy-last-chance"
            labelText="Última chance do espião"
            labelA="A rodada termina ao revelar"
            labelB="Pode tentar adivinhar a palavra"
            toggled={settings.spyLastChance}
            onToggle={(checked) => updateSettings({ spyLastChance: checked })}
          />
        </Tile>

        <Tile className="setting">
          <Slider
            id="timer"
            labelText="Tempo de discussão (minutos)"
            min={1}
            max={20}
            step={1}
            value={settings.timerMinutes}
            onChange={({ value }) => updateSettings({ timerMinutes: value })}
          />
        </Tile>

        <Tile className="setting">
          <fieldset className="categories">
            <legend className="categories__legend">
              Categorias no sorteio
            </legend>
            <p className="categories__help">
              A categoria de cada rodada é sorteada entre as marcadas.
            </p>
            <div className="categories__actions">
              <Button
                size="sm"
                kind="ghost"
                onClick={() => updateSettings({ enabledCategories: [] })}
              >
                Marcar todas
              </Button>
            </div>
            <div className="categories__grid">
              {categories.map((category) => (
                <Checkbox
                  key={category}
                  id={`cat-${category}`}
                  labelText={category}
                  checked={selected.includes(category)}
                  onChange={(_event, { checked }) =>
                    toggleCategory(category, checked)
                  }
                />
              ))}
            </div>
          </fieldset>
        </Tile>

        {selected.length === 0 ? (
          <InlineNotification
            lowContrast
            kind="warning"
            hideCloseButton
            title="Nenhuma categoria marcada"
            subtitle="Todas serão usadas no sorteio."
          />
        ) : null}
      </Stack>

      <Stack gap={3} className="screen__actions">
        <Button size="lg" renderIcon={ArrowLeft} onClick={() => goTo('players')}>
          Voltar aos jogadores
        </Button>
      </Stack>
    </div>
  )
}
