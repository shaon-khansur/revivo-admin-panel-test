import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
    CommonModule,
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
} from '@angular/common';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SettingsAccountComponent } from 'app/modules/settings/account/account.component';
import { SettingsSecurityComponent } from 'app/modules/settings/security/security.component';
import { SettingsPlanBillingComponent } from 'app/modules/settings/plan-billing/plan-billing.component';
import { SettingsNotificationsComponent } from 'app/modules/settings/notifications/notifications.component';
import { SettingsTeamComponent } from 'app/modules/settings/team/team.component';
import { DealcomissionComponent } from './dealcomission/dealcomission.component';

@Component({
    selector: 'app-deal-settings',
    standalone: true,
    imports: [
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        NgFor,
        NgClass,
        NgSwitch,
        NgSwitchCase,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsNotificationsComponent,
        SettingsTeamComponent,
        CommonModule,
        DealcomissionComponent,
    ],
    templateUrl: './deal-settings.component.html',
    styleUrls: ['./deal-settings.component.scss'],
})
export class DealSettingsComponent implements OnInit {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'deals';

    constructor() {}
    ngOnInit(): void {
        // Setup available panels
        this.panels = [
            {
                id: 'deals',
                icon: 'heroicons_outline:clipboard-document-list',
                title: 'Deals Commission',
                description: 'Manage your Deals information',
            },
            {
                id: 'price',
                icon: 'heroicons_outline:currency-dollar',
                title: 'Price',
                description: 'Manage Deal Prices',
            },
        ];
    }

    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
