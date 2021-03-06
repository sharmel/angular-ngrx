import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable, of, Subject} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {CoursesHttpService} from '../services/courses-http.service';
import { CourseEntityService } from '../services/course-entity.service';
import { LessonEntityService } from '../services/lesson-entity.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  loading$: Observable<boolean>;

  lessons$: Observable<Lesson[]>;

  displayedColumns = ['seqNo', 'description', 'duration'];

  nextPage = 0;
  pageSize = 3;

  disableLoadMore = false;

  loadMore$ = new Subject<boolean>();

  constructor(
    private coursesService: CourseEntityService,
    private lessonsService: LessonEntityService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get("courseUrl");

    this.course$ = this.coursesService.entities$
    .pipe(
      map(courses => courses.find(course => course.url == courseUrl))
    );

    this.lessons$ = this.lessonsService.entities$
    .pipe(
      withLatestFrom(this.course$), // combines two observable with lesson entities and course$ and return the two as its response
      tap(([lessons, course]) => {
        if(this.nextPage == 0) {
          this.loadLessonsPage(course);
        }
      }),
      map(([lessons, course]) => {
        const lessonArr = [];
        lessons.filter(lesson => {
          if(lesson.courseId == course.id) {
            lessonArr.push(lesson.courseId);
            if(lessonArr.length == course.lessonsCount) {
            this.loadMore$.next(true);
            } 
          }
        });

        if(course.lessonsCount == undefined) {
          this.loadMore$.next(true);
        } 
        return lessons.filter(lesson => lesson.courseId == course.id)
      }
        
      )
    );

    this.loading$ = this.lessonsService.loading$.pipe(delay(0));

  }


  loadLessonsPage(course: Course) {
    this.lessonsService.getWithQuery({
      "courseId": course.id.toString(),
      "pageNumber": this.nextPage.toString(),
      "pageSize": this.pageSize.toString()
    }
    );

    this.loadMore$.subscribe(next => {
      this.disableLoadMore = next;
    });

    this.nextPage +=1;
  }

}
