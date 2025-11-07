<template>
  <div class="bg-white shadow sm:rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-6">Job Timeline</h2>

    <div class="flow-root">
      <ul role="list" class="-mb-8">
        <li v-for="(event, eventIdx) in timelineEvents" :key="eventIdx">
          <div class="relative pb-8">
            <span
              v-if="eventIdx !== timelineEvents.length - 1"
              class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
            <div class="relative flex space-x-3">
              <div>
                <span
                  :class="[
                    event.iconBackground,
                    'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                  ]"
                >
                  <component :is="event.icon" class="h-5 w-5 text-white" aria-hidden="true" />
                </span>
              </div>
              <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                <div>
                  <p class="text-sm text-gray-900">
                    {{ event.content }}
                  </p>
                </div>
                <div class="whitespace-nowrap text-right text-sm text-gray-500">
                  <time :datetime="event.datetime">{{ event.timeAgo }}</time>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { Job, Installation } from '@/types'

interface Props {
  job: Job
  installation?: Installation | null
}

const props = defineProps<Props>()

interface TimelineEvent {
  content: string
  datetime: string
  timeAgo: string
  icon: any
  iconBackground: string
}

const CheckIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M5 13l4 4L19 7'
    })
  ])
}

const UserIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    })
  ])
}

const CalendarIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    })
  ])
}

const LockIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    })
  ])
}

const TruckIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M13 10V3L4 14h7v7l9-11h-7z'
    })
  ])
}

const WrenchIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
    }),
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    })
  ])
}

const PlayIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
    }),
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      d: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    })
  ])
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return date.toLocaleDateString()
}

const timelineEvents = computed<TimelineEvent[]>(() => {
  const events: TimelineEvent[] = []

  // Job created
  events.push({
    content: 'Job created',
    datetime: props.job.createdAt.toISOString(),
    timeAgo: formatTimeAgo(new Date(props.job.createdAt)),
    icon: PlayIcon,
    iconBackground: 'bg-gray-400'
  })

  // Job assigned
  if (props.job.assignedInstallerId && props.job.supervisorId) {
    events.push({
      content: 'Assigned to installer',
      datetime: props.job.createdAt.toISOString(),
      timeAgo: formatTimeAgo(new Date(props.job.createdAt)),
      icon: UserIcon,
      iconBackground: 'bg-blue-500'
    })
  }

  // Job scheduled
  if (props.job.scheduledDate) {
    events.push({
      content: `Scheduled for ${new Date(props.job.scheduledDate).toLocaleDateString()}`,
      datetime: new Date(props.job.scheduledDate).toISOString(),
      timeAgo: formatTimeAgo(new Date(props.job.scheduledDate)),
      icon: CalendarIcon,
      iconBackground: 'bg-purple-500'
    })
  }

  // OTP verified
  if (props.job.otpVerifiedAt) {
    events.push({
      content: 'Customer identity verified',
      datetime: new Date(props.job.otpVerifiedAt).toISOString(),
      timeAgo: formatTimeAgo(new Date(props.job.otpVerifiedAt)),
      icon: LockIcon,
      iconBackground: 'bg-green-500'
    })
  }

  // Enroute
  if (props.job.enrouteAt) {
    events.push({
      content: 'Installer on the way',
      datetime: new Date(props.job.enrouteAt).toISOString(),
      timeAgo: formatTimeAgo(new Date(props.job.enrouteAt)),
      icon: TruckIcon,
      iconBackground: 'bg-indigo-500'
    })
  }

  // Installation started
  if (props.installation?.startedAt) {
    events.push({
      content: 'Installation started',
      datetime: new Date(props.installation.startedAt).toISOString(),
      timeAgo: formatTimeAgo(new Date(props.installation.startedAt)),
      icon: WrenchIcon,
      iconBackground: 'bg-yellow-500'
    })
  }

  // Device completions
  if (props.installation?.devices) {
    props.installation.devices.forEach((device, index) => {
      if (device.installationCompletedAt) {
        events.push({
          content: `Device ${device.deviceNumber} installation completed`,
          datetime: new Date(device.installationCompletedAt).toISOString(),
          timeAgo: formatTimeAgo(new Date(device.installationCompletedAt)),
          icon: CheckIcon,
          iconBackground: 'bg-green-500'
        })
      }
      if (device.serialCompletedAt) {
        events.push({
          content: `Device ${device.deviceNumber} serial scanned`,
          datetime: new Date(device.serialCompletedAt).toISOString(),
          timeAgo: formatTimeAgo(new Date(device.serialCompletedAt)),
          icon: CheckIcon,
          iconBackground: 'bg-green-500'
        })
      }
    })
  }

  // Activation
  if (props.installation?.activationCompletedAt) {
    events.push({
      content: 'Equipment activated',
      datetime: new Date(props.installation.activationCompletedAt).toISOString(),
      timeAgo: formatTimeAgo(new Date(props.installation.activationCompletedAt)),
      icon: CheckIcon,
      iconBackground: 'bg-green-600'
    })
  }

  // Job completed
  if (props.job.completedDate) {
    events.push({
      content: 'Job completed',
      datetime: new Date(props.job.completedDate).toISOString(),
      timeAgo: formatTimeAgo(new Date(props.job.completedDate)),
      icon: CheckIcon,
      iconBackground: 'bg-green-700'
    })
  }

  // Sort by datetime
  return events.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
})
</script>
