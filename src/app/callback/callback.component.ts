import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenService } from '../_services/authen.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private _services: AuthenService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let code = params['code'];
      let state = params['state'];
      this._services.sendCallback(code, state);
    });
  }

}
