import { IconLanguage } from "@tabler/icons-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/use-i18n";
import { LANGUAGES, type Language } from "@/lib/data/constants";
import { getDirection } from "@/lib/i18n";

export function LangSwitcher() {
	const { t, lang, setLang } = useI18n();

	return (
		<DropdownMenu dir={getDirection(lang)}>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center border gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
				>
					<IconLanguage className="size-4" />
					{t(`lang.${lang}`)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup
					value={lang}
					onValueChange={(value) => setLang(value as Language)}
				>
					{LANGUAGES.map((code) => (
						<DropdownMenuRadioItem
							key={code}
							value={code}
						>
							{t(`lang.${code}`)}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
