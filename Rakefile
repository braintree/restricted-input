require 'rake'
require 'parallel'
require 'rspec/core/rake_task'

RSpec::Core::RakeTask.new(:single) do |t|
  ENV['CONFIG_NAME'] ||= "single"
  t.pattern = Dir.glob('spec/restricted_input_spec.rb')
  t.rspec_opts = '--format documentation'
  t.verbose = false
end

task :default => :test

task :parallel do |t, args|
  @num_parallel = 4

  Parallel.map([*1..@num_parallel], :in_processes => @num_parallel) do |task_id|
    ENV["TASK_ID"] = (task_id - 1).to_s
    ENV['name'] = "parallel_test"
    ENV['CONFIG_NAME'] = "parallel"

    Rake::Task["single"].invoke
    Rake::Task["single"].reenable
  end
end

task :test do |t, args|
  Rake::Task["single"].invoke
  Rake::Task["single"].reenable
  Rake::Task["parallel"].invoke
end
