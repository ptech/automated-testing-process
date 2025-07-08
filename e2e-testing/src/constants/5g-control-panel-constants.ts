/**
 * Constants for 5G Control Panel
 * Centralized location for all hardcoded strings used in the application
 */

export const SECTION_NAMES = {
    OVERVIEW: 'Visão Geral da Rede',
    NETWORK_SLICES: 'Network Slices',
    CONNECTED_DEVICES: 'Dispositivos Conectados',
    QOS_LATENCY: 'QoS e Latência',
    ALERTS_EVENTS: 'Alertas e Eventos'
} as const;

export const BUTTON_NAMES = {
    CLEAR_ALERTS: 'Limpar Alertas',
    CONFIGURE: 'Configurar',
    DEACTIVATE: 'Desativar',
    APPLY: 'Aplicar',
    ADD_NEW_SLICE: 'Adicionar Nova Slice'
} as const;

export const MESSAGES = {
    NO_RECENT_ALERTS: 'Nenhum alerta recente.',
    PAGE_TITLE: 'Painel de Controle 5G Fictício'
} as const;

// Type definitions for better type safety
export type SectionName = typeof SECTION_NAMES[keyof typeof SECTION_NAMES];
export type ButtonName = typeof BUTTON_NAMES[keyof typeof BUTTON_NAMES];
export type Message = typeof MESSAGES[keyof typeof MESSAGES];
