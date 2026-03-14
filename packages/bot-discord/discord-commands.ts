import type { BotAdapter } from "../bot-core/adapter-types";

export interface DiscordInteraction {
  commandName?: string;
  isChatInputCommand?: () => boolean;
  raw?: unknown;
}

export interface SlashCommandOption {
  name: string;
  description: string;
  type: "string" | "integer" | "boolean" | "user" | "channel" | "role";
  required?: boolean;
  choices?: Array<{ name: string; value: string | number }>;
}

export interface SlashCommandDefinition {
  name: string;
  description: string;
  options?: SlashCommandOption[];
  handler: (interaction: DiscordInteraction, adapter: BotAdapter) => Promise<void>;
}

export interface DiscordAdapterExtended extends BotAdapter {
  registerSlashCommands(commands: SlashCommandDefinition[]): Promise<void>;
  onInteraction(handler: (interaction: DiscordInteraction) => Promise<void> | void): void;
}

export function isSlashCommandInteraction(interaction: DiscordInteraction): boolean {
  if (interaction.isChatInputCommand) {
    return interaction.isChatInputCommand();
  }

  return typeof interaction.commandName === "string" && interaction.commandName.length > 0;
}

export function toDiscordCommandPayload(command: SlashCommandDefinition): {
  name: string;
  description: string;
  options?: SlashCommandOption[];
} {
  return {
    name: command.name,
    description: command.description,
    options: command.options,
  };
}